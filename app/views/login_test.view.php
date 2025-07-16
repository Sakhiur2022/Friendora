<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login - Friendora</title>
    <style>
        body {
            background: #f4f4f4;
            font-family: Arial, sans-serif;
        }
        .login-container {
            width: 350px;
            margin: 80px auto;
            padding: 30px 25px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .login-container h2 {
            text-align: center;
            margin-bottom: 25px;
            color: #333;
        }
        .login-container label {
            display: block;
            margin-bottom: 6px;
            color: #555;
        }
        .login-container input[type="text"],
        .login-container input[type="password"] {
            width: 100%;
            padding: 8px 10px;
            margin-bottom: 18px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        .login-container button {
            width: 100%;
            padding: 10px;
            background: #007bff;
            color: #fff;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
        }
        .login-container button:hover {
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
    <div class="login-container">
        <h2>Login</h2> 
      
        <?php if ( !empty($errors)): ?>
            <div class="error-messages"><?=implode("<br>", $errors)?></div>
        <?php endif;?>
        <form method="post" action="<?=ROOT?>/login">
            
            <label for="email">Email</label>
            <input type="text" id="email" name="email" required>

            <label for="pwd">Password</label>
            <input type="password" id="pwd" name="pwd" required>

            <button type="submit">Login</button>
        </form>
    </div>
</body>
</html>