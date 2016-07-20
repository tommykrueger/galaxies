<?php
 
class Database
{
	private static $instance = null;
	private $link;
	
	/**
	 * Get the Database singleton instance.
	 * 
	 * @return Database object
	 */
	public static function getInstance()
	{
		if(!isset(self::$instance))
			self::$instance = new Database(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_CHARSET);
		return self::$instance;
	}
	
	/**
	 * Open the database connection.
	 * 
	 * @param string $db_host Database server host
	 * @param string $db_user username
	 * @param string $db_password password
	 * @param string $db_name Database name
	 * @param string $db_charset Database charset encoding/decoding
	 */
	function Database($db_host, $db_user, $db_password, $db_name, $db_charset)
	{
		$this->link = mysql_connect($db_host, $db_user, $db_password) or die('Could not connect: ' . mysql_error());
		mysql_select_db($db_name) or die ("Database " . $db_name . " not found");
		mysql_query("SET CHARACTER SET ". $db_charset ."", $this->link);
	}
	
	/**
	 * Close the database connection.
	 */
	function __destruct()
	{
		try { mysql_close($this->link); }
		catch(Exception $e) {};
	}
	
	/**
	 * Query the database.
	 * 
	 * @return Array if for queries like SELECT, ... or TRUE/FALSE for queries like INSERT, DELETE, ...
	 * @param string $sql SQL query
	 */
	function query($sql)
	{
		$result = mysql_query($sql, $this->link) or die(mysql_error());

		if(is_resource($result))
		{
			$array = array();
			for($i = 0; $array[$i] = mysql_fetch_assoc($result); $i++);
				array_pop($array);
		
			return $array;
		}
		else
			return $result;
	}
	
	/**
	 * Throw an exception.
	 * 
	 * @param string $message
	 * @see http://ch.php.net/manual/en/language.exceptions.php#81960
	 */
	function throwException($message)
	{
		//throw new Exception($message);
	}
};
?>