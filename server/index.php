<?php 
	
	include_once('zipfile.php');
	include_once('import.php');
	include_once('export.php');

	$action = isset( $_REQUEST['action'] ) ? $_REQUEST['action'] : '';
	$table = isset( $_REQUEST['table'] ) ? $_REQUEST['table'] : '';
	$url = isset( $_REQUEST['url'] ) ? $_REQUEST['url'] : '';

	if ($action === 'export') {

		$export = new Export($table);
		$export->exportAll();

	}

	$urls = [
		'https://ned.ipac.caltech.edu/level5/NED05D/ned05D_1.html',
		'http://skyserver.sdss.org/dr7/en/help/howto/search/query2.asp',
		'http://astrored.net/messier/more/local.html'
	]

?>

<html>
<head>
	<title>ExoPlanetSystems Backend</title>

	<style>

		table {
			width: 80%;
			}
		table th {
			background-color: #f9f9f9;
			}
		table th,
		table td {
			padding: 10px;
			text-align: left;
			border: 1px solid #f0f0f0;
			}

	</style>

</head>
<body>

	<div id="content">
		<h1>Galaxies Backend</h1>
		<p>Export Galaxy Data</p>
	</div>

	<table cellspacing="0" cellpadding="0">
		<tr>
			<th>Type</th>
			<th>Url</th>
			<th>Table</th>
			<th>Action</th>
		</tr>
		<tr>
			<td>JSON</td>
			<td><?php echo $urls[0]?></td>
			<td>galaxies</td>
			<td>
				<a href="index.php?action=export&table=galaxies">Export</a>
			</td>
		</tr>

		<tr>
			<td>JSON</td>
			<td><?php echo $urls[1]?></td>
			<td>SDSS (SkyServer) Galaxies</td>
			<td>
				<a href="index.php?action=export&table=skyserver">Export</a>
			</td>
		</tr>

		<tr>
			<td>JSON</td>
			<td><?php echo $urls[2]?></td>
			<td>Local Group Galaxies</td>
			<td>
				<a href="index.php?action=export&table=local_group">Export</a>
			</td>
		</tr>

	</table>

</body>
</html>