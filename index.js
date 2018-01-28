const spawn = require( 'child_process' ).spawn;
const fs = require( 'fs' );
const path = require( 'path' );

const config = {
	atlasbuilder: {
		enabled: true,
		command: "bin/atlasbuilder/atlasbuilder.exe",
		args: ["--output=ab-default"],
		outputImage: "ab-default.png",
		outputJson: "ab-default.json"
	},
	texturepacker: {
		enabled: true,
		command: "C:/Program Files/CodeAndWeb/TexturePacker/bin/TexturePacker.exe",
		args: ["--png-opt-level", "0", "--max-width", "4096", "--max-height", "4096", "--format", "json", "--sheet", "tp-default.png", "--size-constraints", "POT"],
		outputImage: "tp-default.png",
		outputJson: "out.json"
	}
};

function getInputFiles() {
	return ["input/anim_ace"];
	// const root = 'input/anim_ace';
	// const files = fs.readdirSync( root );
	// return files.map( file => {
		// return path.join( root, file );
	// } );
}

async function test( args ) {
	const inputFiles = getInputFiles();
	const start = Date.now();
	await new Promise( ( resolve, reject ) => {
		const fullargs = args.args.concat( inputFiles );
		console.log( `Executing ${args.command} ${fullargs.join( " " )}` );
		const proc = spawn( args.command, fullargs, { stdio: 'inherit' } );
		proc.on( 'error', reject );
		proc.on( 'close', () => resolve() );
	} );
	const end = Date.now();
	const elapsed = end - start;
	console.log( `Time=${elapsed}ms` );
	
	if ( !fs.existsSync( args.outputImage ) || !fs.existsSync( args.outputJson ) ) {
		console.log( `Test did not output expected files` );
		return false;
	}
	const stat = fs.statSync( args.outputImage );
	console.log( `Output image size=${stat.size} bytes` );
	
//	fs.unlinkSync( args.outputImage );
//	fs.unlinkSync( args.outputJson );
}

async function start() {
	for ( const testName of Object.keys( config ) ) {
		const args = config[testName];
		if ( args.enabled ) {
			await test( args );
		}
	}
}

start();

