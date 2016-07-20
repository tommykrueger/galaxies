<?php

/**
 * Imports CSV data to MySQL database
 */

include_once('config.php');
include_once('database.php');

class Import {
	
	public $table = 'planets';
			
	private $filename = '';
	private $content = array();
	private $db = '';

	private $tableHeader = array();
	private $tableRows = array();

	public function __construct() {
		$this->db = Database::getInstance();
	}

	public function importFromFile( $filename = null ) {

		// var_dump('starting file import');

		if (!file_exists($filename)) {
			exit('The File does not exist');
		}

		$file = fopen($filename, 'r');

		while (!feof($file)) {
			$csvData = fgetcsv($file);

			if ( count($csvData) > 10 ) {
				$this->content[] = $csvData;
			}		  
		}

		fclose($file);

		$this->prepareTableHeader();
		if ($this->insertRows()) {
			echo (count($this->content)-1) . ' rows have been imported.';
		}
	}

	// expects a comma separated string
	public function importFromWebsite( $url = null ) {

		var_dump('starting file import from data');

		if (empty($url)) {
			exit('The File does not exist');
		}

		$file = file_get_contents( $url );
		$file = fopen($url, 'r');

		while (!feof($file)) {
			$csvData = fgetcsv($file);

			if ( count($csvData) > 10 ) {
				$this->content[] = $csvData;
			}		  
		}

		fclose($file);

		$this->prepareTableHeader();
		if ($this->insertRows()) {
			echo (count($this->content)-1) . ' rows have been imported.';
		}
	}

	private function prepareTableHeader() {
		$header = $this->content[0];

		foreach($header as $h) {
			$headerColumn = '';
			$headerColumn = str_replace('. ', '_', $h);
			$headerColumn = str_replace(' ', '_', $headerColumn);
			$headerColumn = strtolower($headerColumn);

			$this->tableHeader[] = $headerColumn;
		}

		$columns = ' id INT NOT NULL AUTO_INCREMENT';
		foreach( $this->tableHeader as $header ) {
    	$columns .= ', `'. $header .'` VARCHAR(255)';
		}
		$columns .= ', PRIMARY KEY( id )';

		$sql = 'CREATE TABLE IF NOT EXISTS '. $this->table .' ('. $columns .')';

		// If the table exists delete it first
		$this->db->query('DROP TABLE IF EXISTS '. $this->table .'');
		$this->db->query($sql);
	}

	private function insertRows() {

		$i = 0;
		foreach( $this->content as $row ) {
			if ($i > 0 && count($row) == count($this->tableHeader) ) {
				$values = ''; 

				$values = ' \'\' ';
				foreach( $row as $column ) {
					$values .= ', \'' . mysql_real_escape_string($column) . ' \' ';	
				}

				$sql = 'INSERT INTO '. $this->table .' VALUES('. $values .')';

				// var_dump($sql);
				$this->db->query($sql);
			}

			$i++;
		}		

		return true;
	}

}

?>