
/*
Ux = 90/1700 * Nx - 55.59
Uy = 70/1840 * Ny - 7.61

Center point is within 5 of actual unity setting, so close enough

Nx = 1700/90 * Ux +1050.03
Ny = 1840/70 * Uy + 200.03
*/

function convertInput() {
	var userArgs = process.argv.slice(2);
	i = 0;
	console.log('length='+userArgs.length);
	while (i < userArgs.length) {
		var x=calcx(userArgs[i]);
		var y=calcy(userArgs[i+1]);
		console.log(userArgs[i] +", "+userArgs[i+1] +" = "+x+", "+y);
		
		i = i+2;
		
	}

}

function calcx(xval) {
	var result = ((1700/90) * xval) + 1050.03;
	return result.toFixed(2);
	//console.log(result.toFixed(2));
}

function calcy(yval) {
	var result = ((1840/70) * yval) + 200.03;
	return result.toFixed(2);
	//console.log(result.toFixed(2)+'\n');
}

convertInput();

