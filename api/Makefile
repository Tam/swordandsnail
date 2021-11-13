.DEFAULT_GOAL := help

# Include our local ENV file
include .env

# Variables
red=\033[31m
blue=\033[36m
grey=\033[37m
green=\033[32m
pink=\033[95m
bold=\033[1m
blank=\033[0m
help_padding=10

make_int=$(MAKE) --no-print-directory

db_file:="./$(PGDATABASE)"

## =============================
##    ⚔️ Sword & Snail (API)
## -----------------------------

.PHONY: help
help:
	@grep -E '^([a-zA-Z_-]+:.*?## .*)|(^##.*\.?)$$' $(MAKEFILE_LIST) | awk '{gsub(/^Makefile:/,"")}; BEGIN {FS = "(:.*?## )"}; {gsub(/^## /,"\033[95m");} {gsub(/^### /,"\n\033[95m");} {gsub(/^##_/,"");} {printf "\033[36m%-$(help_padding)s\033[0m %s\n", $$1, $$2}'

### 🔗 Database

.PHONY: migrate
migrate: ## Migrate SQL Schema ([file=abc])
	@echo "$(grey)Migrating schema...$(blank)"
	@docker-compose exec -T $(PGHOST) psql --quiet -U $(PGUSER) -d $(PGDATABASE) < schema.sql
	@echo "$(green)Migration complete (hopefully)!$(blank)"

.PHONY: backup
backup: ## Backup the database
	@echo "$(grey)Backing up \`$(PGDATABASE)\`...$(blank)"
	@docker-compose exec -T $(PGHOST) pg_dump --data-only $(PGDATABASE) -U $(PGUSER) > $(db_file)
	@echo "$(green)Backup saved (hopefully)!$(blank)"

.PHONY: restore
restore: ## Restore the database from backup (accepts keep=true)
	@echo "$(grey)Restoring database...$(blank)"
	@echo "set session_replication_role = replica;" | cat - $(db_file) > $(db_file)_temp && mv $(db_file)_temp $(db_file)
	@docker-compose stop graph worker
	@docker-compose exec $(PGHOST) dropdb --if-exists -U $(PGUSER) $(PGDATABASE)
	@docker-compose exec $(PGHOST) createdb -U $(PGUSER) $(PGDATABASE)
	@docker-compose start worker
	@$(make_int) migrate
	@$(make_int) migrate
	@$(make_int) migrate
	@docker-compose stop worker
	@docker-compose exec -T $(PGHOST) psql -v ON_ERROR_STOP=0 $(PGDATABASE) -U $(PGUSER) < $(db_file)
	@docker-compose start graph worker
ifndef keep
	@rm $(db_file)
endif
	@echo "$(green)Database restored (hopefully)!$(blank)"

### 🐳 Docker

.PHONY: makeDirs
makeDirs: ## Make required directories
	@mkdir -p .data/db
	@mkdir -p .data/logs

.PHONY: reup
reup: ## Restart docker with DEV config
	@$(make_int) down
	@$(make_int) up

.PHONY: reupGraph
reupGraph: ## Restarts the graph container
	@docker-compose restart graph

.PHONY: reupWorker
reupWorker: ## Restarts the worker container
	@docker-compose restart worker

.PHONY: reupProd
reupProd: ## Restart docker with PROD config
	@$(make_int) down
	@$(make_int) upProd

.PHONY: up
up: ## Run docker with DEV config
	@echo "$(grey)Raising docker containers from the dead (DEV)$(blank)"
	@$(make_int) makeDirs
	@docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

.PHONY: upProd
upProd: ## Run docker with PRODUCTION config
	@echo "$(grey)Raising docker containers from the dead$(blank)"
	@$(make_int) makeDirs
	@docker-compose up -d

.PHONY: down
down: ## Bring docker down
	@echo "$(grey)Taking the docker containers live on a farm$(blank)"
	@docker-compose down --remove-orphans

.PHONY: build
build: ## Pull and build docker
	@echo "$(grey)Attempting to pull docker at the bar$(blank)"
	@docker-compose pull;
	@docker-compose build --pull;

.PHONY: prune
prune: ## Prune docker
	@echo "$(grey)Giving docker a good pruning$(blank)"
	@docker system prune -f;

.PHONY: pruneGuff
pruneGuff: ## Will prune all the docker guff
	@docker system prune -af --volumes

.PHONY: startAdminer
startAdminer: ## Will start the adminer container
	@echo "$(grey)Starting the adminer container$(blank)"
	@docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d adminer

.PHONY: stopAdminer
stopAdminer: ## Will stop the adminer container
	@echo "$(grey)Stopping the adminer container$(blank)"
	@docker-compose -f docker-compose.yml -f docker-compose.dev.yml stop adminer
	@docker-compose -f docker-compose.yml -f docker-compose.dev.yml rm -f

### 🚀 Server

.PHONY: deploy
deploy: ## Deploy API
	@#$(make_int) build
	@#$(make_int) upProd
	@$(make_int) migrate
	@$(make_int) reupGraph
	@$(make_int) reupWorker
	@#$(make_int) prune
	@#$(make_int) down
	@#$(make_int) upProd

##_
## ==========================
