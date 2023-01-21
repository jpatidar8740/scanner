# scanner

## Prerequisites:
* Nodejs >= 14.x

## How to install?

Clone this repo in your local and run:
1. ```npm install```

2. ```npm start```

Go to localhost:3000/ to use the app.

## How to use?

1. Use up/down/left/right arrow to move camera.

2. Ideally user shouldn't have option to reset the grid but uou can reset the grid as we can't restart hosted server every time.

3. By default camera focuses on approx. middle of grid and starts op1 & op2 without user input.

4. Machine do not re-process already processed cell.


Guide:
1. . means not processed.
2. O means ignored.
3. 🔬 means focusing.
4. 📸 means capturing.
5. ✅ means processed.
