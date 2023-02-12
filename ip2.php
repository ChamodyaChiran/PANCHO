<html>
<head>
	<title>IP Info</title>
</head>
<body>
<h2>Information about your connection</h2>
<?php 
$info = $_SERVER['REMOTE_ADDR'];
$info1 = $_SERVER['HTTP_USER_AGENT'];
if(isset($_GET['q'])) { $info = gethostbyname($_GET['q']); }
echo "<b>Your public IP address is: </b> $info";
echo "<br><b>Reverse DNS: </b>" . gethostbyaddr($info);
$stage1 = file_get_contents("http://ip-api.com/json/$info");
$stage2 = json_decode($stage1, true);
echo "<br><b>ISP: </b>".$stage2["isp"];
echo "<br><b>Organization: </b>".$stage2["org"];
echo "<br><b>Location: </b>".$stage2["city"].", ".$stage2["regionName"].", ".$stage2["country"];
echo "<br><br><b>User-Agent:</b> $info1";
?>
</body>
</html>
