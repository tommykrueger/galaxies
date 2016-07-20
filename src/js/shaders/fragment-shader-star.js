varying vec3 vNormal;
varying vec2 vUv;

uniform vec3 color;
uniform sampler2D texture;

void main() {

	vec3 light = vec3( 0.5, 0.2, 1.0 );
	light = normalize( light );

	float dProd = dot( vNormal, light ) * 0.5 + 0.5;

	vec4 tcolor = texture2D( texture, vUv );
	vec4 gray = vec4( vec3( tcolor.r * 0.1 + tcolor.g * 0.7 + tcolor.b * 0.11 ), 1.0 );

	gl_FragColor = vec4( 0.5, 0.2, 1.0, 1.0 );

}