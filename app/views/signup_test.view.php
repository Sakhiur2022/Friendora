<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>signup</title>
    <style>
       body {
          font-family: Arial, sans-serif;
          background: #f4f4f4;
          margin: 0;
          padding: 0;
       }
       .signup-container {
          background: #fff;
          max-width: 400px;
          margin: 40px auto;
          padding: 30px 25px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
       }
       .signup-container h2 {
          margin-bottom: 20px;
          text-align: center;
          color: #333;
       }
       .signup-container label {
          display: block;
          margin-bottom: 6px;
          color: #555;
       }
       .signup-container input[type="text"],
       .signup-container input[type="email"],
       .signup-container input[type="password"],
       .signup-container input[type="date"] {
          width: 100%;
          padding: 8px 10px;
          margin-bottom: 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-sizing: border-box;
       }
       .signup-container button {
          width: 100%;
          padding: 10px;
          background: #007bff;
          color: #fff;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
       }
       .signup-container button:hover {
          background: #0056b3;
       }
       .error-messages {
          background: #ffe6e6;
          color: #d8000c;
          border: 1px solid #d8000c;
          border-radius: 4px;
          padding: 10px 15px;
          margin-bottom: 18px;
          font-size: 15px;
       }
    </style>
    
</head>
<body>
   
    <div class="signup-container">
        <h2>Sign Up</h2>

        <?php if ( !empty($errors)): ?>
            <div class="error-messages"><?=implode("<br>", $errors)?></div>
        <?php endif;?>
      <form method="post" action="<?=ROOT?>/signup" novalidate>
          <label for="fname">First Name</label>
          <input type="text" id="fname" name="fname" required>

          <label for="minit">Middle Initial</label>
          <input type="text" id="minit" name="minit" maxlength="1">

          <label for="lname">Last Name</label>
          <input type="text" id="lname" name="lname" required>

          <label for="email">Email</label>
          <input type="email" id="email" name="email" required>

          <label for="password">Password</label>
          <input type="password" id="password" name="pwd" required>

          <label for="dob">Date of Birth</label>
          <input type="date" id="dob" name="dob" required>

          <label for="gender">Gender</label>
          <select id="gender" name="gender" required>
           <option value="">Select Gender</option>
           <option value="male">Male</option>
           <option value="female">Female</option>
          </select>

          <div style="margin: 12px 0;">
           <input type="checkbox" id="terms" name="terms" required>
           <label for="terms" style="display:inline;">I accept the <a href="#">Terms and Conditions</a></label>
          </div>

          <button type="submit">Sign Up</button>
      </form>
    </div>
     <div style="text-align:center; margin-top: 20px;">
      <span>Already have an account?</span>
      <a href="<?=ROOT?>/login">
         <button type="button" style="margin-left:8px; background:#6c757d;">Login</button>
      </a>
   </div>
</body>
</html>