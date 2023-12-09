if(isset($_POST['posted']))
{
  $name = $_POST['name'];
  $pass = $_POST['pass'];

  if(!ctype_alpha($name))
  {
    echo "please enter name in alphabets";
    exit;
  }

  if($name == 'muneeb' && $pass == 'abcd')
  {
    header("location:1st.php");
    exit;
  }
  else
  {
    echo "you entered the wrong password";
    exit;
  }
}
