uniform sampler2D texture;

varying vec3 vColor;

void main() {

	vec3 c = vColor;
	gl_FragColor = vec4( c, 1.0 );

	gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );

}