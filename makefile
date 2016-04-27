all: lib/index.js

lib/%.js: src/%.js lib
	node_modules/.bin/babel $< -o $@

lib:
	mkdir -p lib
