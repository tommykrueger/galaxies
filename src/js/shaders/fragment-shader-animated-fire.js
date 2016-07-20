varying vec2 vUv;
varying float noise;
uniform sampler2D tNoise;
uniform float time;

float random( vec3 scale, float seed ){
  return fract( sin( dot( gl_FragCoord.xyz + seed, scale ) ) * 43758.5453 + seed ) ;
}



float hash21(vec2 n){ 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453); 
}

mat2 makem2(float theta){
	float c = cos(theta);float s = sin(theta);return mat2(c,-s,s,c);
}

float pnoise( vec2 x ){
	return texture2D(tNoise, x*.01).x;
}

vec2 gradn(vec2 p)
{
	float ep = .09;
	float gradx = pnoise(vec2(p.x+ep,p.y))-pnoise(vec2(p.x-ep,p.y));
	float grady = pnoise(vec2(p.x,p.y+ep))-pnoise(vec2(p.x,p.y-ep));
	return vec2(gradx,grady);
}

float flow(vec2 p)
{
	float z=2.;
	float rz = 0.;
	vec2 bp = p;

	for (float i= 1.;i < 7.;i++ )
	{
		//primary flow speed
		p += time*.6;
		
		//secondary flow speed (speed of the perceived flow)
		bp += time*1.9;
		
		//displacement field (try changing time multiplier)
		vec2 gr = gradn(i*p*.34+time*1.);
		
		//rotation of the displacement field
		gr*=makem2(time*6.-(0.05*p.x+0.03*p.y)*40.);
		
		//displace the system
		p += gr*.5;
		
		//add noise octave
		rz+= (sin(pnoise(p)*7.)*0.5+0.5)/z;
		
		//blend factor (blending displaced system with base system)
		//you could call this advection factor (.5 being low, .95 being high)
		p = mix(bp,p,.77);
		
		//intensity scaling
		z *= 1.4;
		//octave scaling
		p *= 2.;
		bp *= 1.9;
	}
	return rz;	
}


void main() {

	// get a random offset
  //float r = .01 * random( vec3( 12.9898, 78.233, 151.7182 ), 0.0 );

  // lookup vertically in the texture, using noise and offset
  // to get the right RGB colour

  //vec2 tPos = vec2( 0, 0.85 - 1.3 * noise + r );
  //vec4 color = texture2D( tExplosion, tPos );

  //gl_FragColor = vec4( color.rgb, 1.0 );

  vec2 p = -1.0 + 2.0 *vUv -0.5;
	//p.x *= iResolution.x/iResolution.y;
	p*= 3.;
	float rz = flow(p);
	
	vec3 col = vec3(.2,0.07,0.01)/rz;
	col = pow(col, vec3(1.4));
	gl_FragColor = vec4(col, 1.0);

}
