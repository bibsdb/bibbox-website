#!/bin/sh
cd "$(dirname "$0")"

# Install PHP/symfony packages
php -v
echo
composer install --no-dev -o

# Run database migrations
echo
bin/console doctrine:migrations:migrate

# Build frontend packages
echo
echo "NPM version:" "$(npm -v)" "/ Node version:" "$(node -v)"
echo
npm run build

# Install engine packages
echo
./engine/scripts/install.sh
