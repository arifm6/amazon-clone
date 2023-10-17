# Amazon Clone

Welcome to my Amazon Clone. You can find a live demo at [https://amazon-clone-arifm6.vercel.app/](https://amazon-clone-arifm6.vercel.app/).

## DISCLAIMER and Functional Features

Some of the things you see on the page are not functional and are only their for presentation purposes. Here is an example: ![Non-functional features](/public/non-functional-links.png). All the links here do not work. I did not bother setting it up. Everything else works as intended. Additionally, I did not add user response on certain button clicks such as add to cart. However, you can tell they work by clicking add to cart and checking the number overlapping the cart icon on the right side of the navbar.

### `Authentication`

You can log in and out by clicking the ![Alt text](/public/sign-in-button.png) on the navbar. You can use the same button to sign out. Only Github and google login in supported. Logging in also saves your items to your account which persists between different devices.

### `Checkout and Orders`

Once you are logged in, you can check out items in your cart and "pay" for them. This redirects to a stripe session where you can use dummy information to simulate a real life payment platform. You can use 424242.... for credit card information and give any address/info. Once you have paid for your items, you can check your returns and orders page to see items you have purchased in the past.

### `Bugs`

There may be a few bugs that I have not bothered to fix but I am aware of them. There is a bug that prevents checkout when there are too many items in your cart. This is because the metadata character information on the total number of items exceeds the allowed number of characters. This is a simple fix but I have retired this project. There are various other minor bugs in the same boat.
