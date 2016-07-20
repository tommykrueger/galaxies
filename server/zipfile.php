<?php 

class Zipfile {
		
	private $filename = '';
	private $path = '';
	private $csvfile = '';

	private $content = '';

	public function __construct( $filename, $path ) {

		$this->filename = $filename;
		$this->path = $path;

		// set_time_limit(0); 
		$file = file_get_contents( $this->filename );
		file_put_contents( $this->path, $file );
	}

	public function save( $filetype = 'zip' ) {

		if ($filetype == 'zip') {

			$zip = zip_open($this->path); 

			if (is_resource($zip)) { 
				while ($zip_entry = zip_read($zip)) { 

					if (zip_entry_open($zip, $zip_entry)) { 
						$this->contents .= zip_entry_read($zip_entry, zip_entry_filesize($zip_entry)); 
						zip_entry_close($zip_entry); 
					} 

				} 

				zip_close($zip);

			} else
				exit('The Zip File cannot be read');
		}
	}

	public function unpack() {
		if (!empty($this->contents) && $this->path) {

			$this->csvfile = explode('.zip', $this->path);

			if (!$handle = fopen($this->csvfile[0], "w+")) {
	      exit('Cannot read the file');
	    }

	    if (!fwrite($handle, $this->contents)) {
	      exit('Cannot write to file');
	    }

	    // echo 'CSV File has been created';

	    return $this->csvfile[0];

	    fclose($handle);
		}

		return false;
	}

}

?>