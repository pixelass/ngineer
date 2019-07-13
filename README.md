# ngineer

Web development made easy.

A collection of extendable configuration files and cli commands.

* ava
* babel
* commitlint
* husky
* nyc
* postcss
* prettier
* rollup
* stylelint
* tslint
* tsconfig
* webpack

## Create Ngineer app

Create React apps on the fly.

Includes SSR and a mock server. 

````bash
yarn create ngineer-app
````

## Bin

````bash
yarn add @ngineer/cli
````

````
	Usage
	  $ ngineer <input> [...flags]

	Options
	  --prod,   -p   enable production mode
	  --fix,    -f   fix linting errors
	  --tsc,    -t   pack with tsc
	  --rollup, -r   pack with rollup.js
	  --watch,  -w   watch files
	  --update, -u   update snapshots

````

### Transpile

Ngineer allows transpiling via tsc, rollup or babel (default)

````bash
ngineer
ngineer --rollup
ngineer --tsc
````

### Build

Ngineer builds isomorphic React apps.

````bash
ngineer build
````

### Develop

Ngineer serves isomorphic React apps via a dev server.

````bash
ngineer dev-server
````

### Clean

Ngineer cleans output folders and more

````bash
ngineer clean
ngineer clean node_modules
````

### Format 

Ngineer will format files with prettier.

````bash
ngineer format "**/*.tsx?"
````

### Lint 

Ngineer will lint files with stylelint and tslint.

````bash
ngineer lint "**/*.tsx?"
````

### Test

Ngineer uses Ava for testing and nyc for coverage.

````bash
ngineer test
````
