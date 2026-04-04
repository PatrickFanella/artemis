package config

import (
	"os"
	"strconv"

	"github.com/rs/zerolog"
)

type Config struct {
	Port     int
	DBPath   string
	LogLevel zerolog.Level
}

func Load() Config {
	cfg := Config{
		Port:     8090,
		DBPath:   "artemis.db",
		LogLevel: zerolog.InfoLevel,
	}

	if v := os.Getenv("PORT"); v != "" {
		if p, err := strconv.Atoi(v); err == nil {
			cfg.Port = p
		}
	}

	if v := os.Getenv("DB_PATH"); v != "" {
		cfg.DBPath = v
	}

	if v := os.Getenv("LOG_LEVEL"); v != "" {
		if lvl, err := zerolog.ParseLevel(v); err == nil {
			cfg.LogLevel = lvl
		}
	}

	return cfg
}
