class CLASS_NAME {
	//tracer = require( "tracer" ).console( { transport: function ( data ) { process.stdout.write( data.output + "\n" ) }, format: "{{timestamp}} {{file}}:{{line}} {{method}} {{message}}", dateformat: "HH:MM:ss.l", } );
	constructor () {
	}

	main ( obj, callback ) {	// callback goes to the process run next. It might be do-nothing if we are calling this class directly
		let resolver = null;
		let tracer = { log: function () { } };
		if ( obj?.tracer?.log ) { tracer = obj.tracer }
		let clone = require( 'deep-clone' );

		return {
			abort: function () {
				resolver( 'ABORTED' );
				return 'ABORT MESSAGE';
			},

			promise: new Promise( async function CLASS_NAME_promise ( resolve, reject ) {	// resolve just resolves the promise, don't use reject which will throw an error back to the caller
				try {
					resolver = resolve;
					let tracer = require( "tracer" ).console( { format: "{{timestamp}} {{file}}:{{line}} {{method}} {{message}}", dateformat: "HH:MM:ss.l" } );
					let { info, request } = obj;
					//tracer.log( JSON.stringify( request.urlParsed, null, 4 ) );

					//tracer.log( typeof handle );
					let params = request.urlParsed.parameters;
					tracer.log( params );
					let { service, courseId, path, data } = params;
					//tracer.log(service);

                    let code = params.code;

					let dataResult = {
						result: "OK",
						success: true,
						response: {
							contentType: "application/json",
							status: 200,
							content: { code }
						},
					};

					// //tracer.log(info?.config?.postgres);
					// //tracer.log(info?.config?.postgres[service]);

					// if ( !service || !info?.config?.postgres[service] ) {
					// 	let msg = { result: 'FAIL', params, message: 'Missing session service name' };
					// 	callback( msg );
					// 	resolve( msg );
					// 	return;
					// }
					// if ( !courseId ) {
					// 	let msg = { result: 'FAIL', params, message: 'Missing course ID' };
					// 	callback( msg );
					// 	resolve( msg );
					// 	return;
					// }
					// let values = [];
					// tracer.log(values);
					// // (new Date('2022-03-28T00:00:00-0400')).getTime()+86400000
					// // update courses
					// // set data = jsonb_set( data, '{course}', '{"three":3}', true )
					// // , ts_update = now()
					// // where id = 'e105e99c5c7f0102daf2504284d9606d'
					// let sql = `
					// 	update courses
					// 	set data = jsonb_set(data,'{${path.join(',')}}','${JSON.stringify(data)}'), ts_update = now()
					// 	where id = '${courseId}'
					// `;
					// tracer.log(sql);
					// let result = await pgSQL( info.config.postgres[service], sql, values );
					// //tracer.log( result.rows );
					// if ( result instanceof Error ) {
					// 	//tracer.log(sql);
					// 	//tracer.log(values);	
					// 	//tracer.log( result );
					// 	let msg = { result: 'FAIL - SQL Error', message: result.message };
					// 	tracer.log( msg );
					// 	callback( msg )
					// 	resolve( msg );
					// 	return;
					// }
					// dataResult.response.content = { command:result.command, rowCount:result.rowCount };
					tracer.log( dataResult );
					callback( dataResult );
					resolve( dataResult );
					return;
				}
				catch ( error ) {
					//tracer.log( error );
					callback( { result: 'ERROR', error, message: error.message, stack: error.stack.split( /\n/ ) } );
					resolve( {} );
				}
			} )
		}
	}

	test ( obj ) {
		let tracer = { log: function () { } };
		if ( obj?.tracer?.log ) { tracer = obj.tracer }
		return new Promise( ( resolve, reject ) => {	// resolve just resolves the promise, don't use reject which will throw an error back tot the caller
			try {
				resolve( { result: 'OK' } );
			}
			catch ( error ) {
				resolve( { result: 'ERROR', message: error.message, error } );
			}
		} );
	}


}

function pgSQL ( connect, sql, data ) {
	return new Promise( async ( resolve, reject ) => {
		//tracer.log(connect);
		try {
			let { Pool } = require( 'pg' );
			let pool = new Pool( connect );
			pool.query( sql, data, ( error, response ) => {
				if ( error ) {
					tracer.log( error );
					resolve( error );
					return;
				}
				else {
					//tracer.log(sql);
					//tracer.log(data);
					//tracer.log( response );
					resolve( response );
					return;
				}
			} );
			pool.end();
		}
		catch ( error ) {
			tracer.log( error );
			resolve( error );
		}
	} );
}