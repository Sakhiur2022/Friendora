<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="icon" type="image/svg+xml" href="<?=ROOT?>/assets/images/favicon.svg">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f8f9fa;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.07);
            padding: 32px;
        }
        h1, h2 {
            color: #333;
        }
        ul {
            padding-left: 20px;
        }
        li {
            margin-bottom: 8px;
        }
        p {
            color: #555;
        }
    </style>
</head>  
<body>
  
    <div class="container">
        <?php if ( Utils::user()!== null): ?>
            <h1>Welcome, <?= htmlspecialchars(Utils::user('fname')) ?>!</h1>
            <p>Your email: <?= htmlspecialchars(Utils::user('email')) ?></p>
            <p>Your full name: <?= Utils::escape(Utils::User('fname')." ".Utils::User('minit')." ".Utils::User('lname')) ?></p>
            <?php
            if (!empty(Utils::user('DOB'))) {
                $dob = new DateTime(Utils::user('DOB'));
                $now = new DateTime();
                $age = $now->diff($dob)->y;
                echo "<p>Your age: " . htmlspecialchars($age) . "</p>";
            }
            ?>
            <p>Current Date: <?= htmlspecialchars($date) ?></p>
            


            <h2>Your Posts</h2>
            <?php if (!empty($user->posts)): ?>
                <ul>
                    <?php foreach ($user->posts as $post): ?>
                        <li><?= htmlspecialchars($post) ?></li>
                    <?php endforeach; ?>
                </ul>
            <?php else: ?>
                <p>You have no posts yet.</p>
            <?php endif; ?>
        <?php else: ?>
            <p>User not found.</p>
        <?php endif; ?>
        <form action="<?=ROOT?>/logout" method="post" style="margin-top: 24px; text-align: right;">
            <button type="submit" style="background: #e74c3c; color: #fff; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
            Logout
            </button>
        </form>
        <form action="<?=ROOT?>/profile" method="post" style="margin-top: 12px; text-align: right;">
            <button type="submit" style="background: #3498db; color: #fff; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
                Go to Profile
            </button>
        </form>
    </div>
</body>
</html>