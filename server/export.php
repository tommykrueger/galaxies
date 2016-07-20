<?php 

include_once('config.php');
include_once('database.php');

class Export {
		
	private $filename = '';
	private $content = array();
	private $db = '';

	private $table = '';
	private $tableHeader = array();
	private $tableRows = array();

	private $constellations = array();

	// AU in KM
	private $AU = 149597870.700;

	// Parsec in LY
	private $LY = 3.2615638;

	public function __construct( $table = 'planets' ) {
		$this->table = $table;
		$this->db = Database::getInstance();
	}

	public function exportAll() {
		//$this->exportConstellations();
		//$this->exportNamedStars();
		//$this->exportStars();
		$this->exportGalaxies();
		//$this->exportSkyServerGalaxies();
		//$this->exportLocalGroupGalaxies();
	}

	public function exportConstellations() {
		$this->constellations = $this->db->query('SELECT * FROM constellations');		
		file_put_contents('../public/data/constellations.json', json_encode($this->constellations));
	}


	public function exportGalaxies() {

		$galaxiesArray = array();

		$galaxies = $this->db->query("

			SELECT distinct(number), name, distance_pc, ra, declination FROM ".$this->table."

		");

		$i = 0;

		foreach ($galaxies as $galaxy) {
			
			if ($i <= 100000) {

				$galaxyArray = array();
				$galaxyArray['id'] = $i;
				$galaxyArray['n'] = trim($galaxy['name']);

				// distance in mega parsec
				$galaxyArray['d'] = ((float) $galaxy['distance_pc'] * 1000000 ) * $this->LY;
				$galaxyArray['ra'] = $this->convertGeoToDec( $galaxy['ra'], 'ra');
				$galaxyArray['dec'] = $this->convertGeoToDec( $galaxy['declination'], 'dec' );

				$galaxiesArray[] = $galaxyArray;

			}

			$i++;
		}

		file_put_contents('../public/data/galaxies.json', json_encode($galaxiesArray));
	}


	
	public function exportSkyServerGalaxies() {

		$galaxiesArray = array();

		$galaxies = $this->db->query("

			SELECT * FROM " . $this->table . "

		");

		$i = 0;

		foreach ($galaxies as $galaxy) {
			
			if ($i <= 100000) {

				$galaxyArray = array();
				$galaxyArray['id'] = $i;
				$galaxyArray['ra'] = (float) str_replace('\'', '', $galaxy['ra']);
				$galaxyArray['dec'] = (float) str_replace('\'', '', $galaxy['declination']);
				$galaxyArray['z'] = (float) str_replace('\'', '', $galaxy['z']);

				$galaxiesArray[] = $galaxyArray;

			}

			$i++;
		}

		file_put_contents('../public/data/galaxies_skyserver.json', json_encode($galaxiesArray));
	}





	public function exportLocalGroupGalaxies() {

		$galaxiesArray = array();
		$galaxies = $this->db->query("SELECT * FROM " . $this->table . "");

		$i = 0;

		foreach ($galaxies as $galaxy) {
			
			if ($i <= 100000) {

				$galaxyArray = array();
				$galaxyArray['i'] = (int) $galaxy['id'];
				$galaxyArray['n'] = $galaxy['name'];
				$galaxyArray['ra'] = $this->convertGeoToDec( $galaxy['ra'], 'ra');
				$galaxyArray['dec'] = $this->convertGeoToDec( $galaxy['declination'], 'dec' );
				$galaxyArray['d'] = (float) $galaxy['dist'] * 1000;
				
				$dim = $galaxy['dim'];
				$dim = explode('x', $dim);

				if (is_array($dim) && count($dim) == 2) {

					$galaxyArray['w'] = (float) $dim[0] * $galaxyArray['d'] * 0.000291;
					$galaxyArray['h'] = (float) $dim[1] * $galaxyArray['d'] * 0.000291;

				}

				$galaxiesArray[] = $galaxyArray;

			}

			$i++;
		}

		file_put_contents('../public/data/local_group.json', json_encode($galaxiesArray));
	}



	private function convertGeoToDec ($num, $type) {

		// $num = str_replace('.', ':', $num);
		$sections = explode(':', $num);
		$toReturn = 0.0;

		if (count($sections) == 3) {

			if ($type == 'ra') {
				$toReturn = $sections[0] * 15;
				$toReturn += $sections[1] * 0.25;
				$toReturn += $sections[2] * 0.004166;
			}

			if ($type == 'dec') {
				$toReturn = abs($sections[0]);
				$toReturn += ($sections[1] / 60);
				$toReturn += ($sections[2] / 3600);
			}

			if ($sections[0] < 0)
				$toReturn = -$toReturn;
		}

		return (float) round($toReturn, 4);

	}




	private function getConstellation( $star ) {
		foreach ($this->constellations as $constellation) {
			if (trim(strtolower($constellation['abbreviation'])) === trim(strtolower($star['s_constellation']))) {
				return $constellation;
			}
		}
	}

	
	private function getValue( $val, $type = null ) {
		if ($type == 'f')
			return (float)trim($val);
		if ($type == 'int')
			return (float)trim($val);
		else
			return trim($val);
	}

}

// $export  = new Export('hygstars');
// $export->exportData();

?>