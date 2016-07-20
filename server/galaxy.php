<?php 

include_once('config.php');
include_once('database.php');

class Galaxy {
		
	private $id = 0;
	private $db = '';

  public function __construct( $id = 0 ) {

    $this->id = $id;
    $this->db = Database::getInstance();

  }

  public function getJSON() {

    if ($this->id != null) {

      $galaxy = $this->db->query('SELECT * FROM local_group WHERE id = '. $this->id .' ');  

      echo json_encode($galaxy[0]);

    }

  }

}

$galaxy = new Galaxy( isset($_REQUEST['id']) ? $_REQUEST['id'] : null );
$galaxy->getJSON();


?>