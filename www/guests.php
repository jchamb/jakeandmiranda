<?php
include_once "db.php";
if(!isset($_POST['action'])) header('Location: http://jakeandmiranda.com');



/* ----------------------- Quick Router ----------------------- */


switch($_POST['action'])
{
	case "find":
		findGuests();
	break;

	case "register":
		registerGuests();
	break;
}

/* ---------------------------------------------------------- */



function findGuests()
{
	if( !empty($_POST['last_name']) )
	{
		$sql = "SELECT * 
				FROM  `guests` 
				WHERE  `guests`.`group` 
				IN (
					SELECT  `group` 
					FROM  `guests` 
					WHERE last_name = ?
				)
				AND attending < 1
				ORDER BY `group` ASC, first_name ASC, last_name ASC";

		$data    = array(filter_var($_POST['last_name'], FILTER_SANITIZE_STRING));
		$results = get($sql, $data);


		if(! empty($results)) {

			$last_group = $results[0]->group;
			
			echo '<form action="/guests.php" method="post">'."\n"
			     . "<ul class=\"guests\">\n<li>\n<ul>\n";

			foreach ($results as $guest) {

				if($guest->group != $last_group)
				{
					echo "</ul>\n</li>\n<li>\n<ul>";
				}

				echo "
				<li>
					<input type=\"checkbox\" id=\"guest-{$guest->id}\" name=\"guest[{$guest->id}]\" value=\"1\">
					<label for=\"guest-{$guest->id}\">$guest->first_name $guest->last_name</label>
				</li>
				";
				
				if($guest->guest) {

					echo "
					<li>
						<input type=\"checkbox\" id=\"guest-{$guest->id}\" name=\"guest[{$guest->id}_guest]\" value=\"1\">
						<label for=\"guest-{$guest->id}\">$guest->first_name $guest->last_name Guest</label>
					</li>
					";
				}

				$last_group = $guest->group;
			}

			echo "</ul>\n</li>\n</ul>\n"
				 . '<input type="submit" name="submit" class="submit" id="name-submit" value="I\'m / We\'re Coming" />'
	             . '<input type="hidden" name="action" value="register">'."\n"
	             . '</form>'."\n";
		
		} else {
			echo '<div class="alert alert--error">Sorry, can\'t find you.</div>';
		}

		exit;
	}
	else
	{
		echo '<div class="alert alert--error">Sorry, we\'re experiencing som problems. Try again in a bit.</div>';
		exit;
	}
}





function registerGuests()
{

}



/**
 * Get the database connection
 */
function DB()
{
	try {
	  	// MySQL with PDO_MYSQL
	  	$DBH = new PDO("mysql:host=".DB_HOST.";dbname=".DB_DATABASE, DB_USER, DB_PASSWORD);
		return $DBH;
	}
	catch(PDOException $e) {
	    return false;
	    //echo $e->getMessage();
	}
}



function get($sql, $data)
{
	$db = DB();
	$STH = $db->prepare($sql);
	//var_dump($db); die;
		
	$STH->execute($data);
	//$STH->setFetchMode();

	return $STH->fetchAll(PDO::FETCH_OBJ);
}



