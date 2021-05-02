

# Real time Calculator

A simple online calculator buit with Node, express and socket.io. The calculator shares calculations with everyone connected to the app in realtime. The backend keeps he history of last 10 calculations in local memory. The calculator only needs to implement basic arithmetic operations.

For example, user A and user B go to your app at the same time. User A calculates “5 + 5”, which equals “10". This is logged below the calculator as “5 + 5 = 10”. User B is updated about this calculation right after user A posts it. Now, user B calculates “3 x 4".This calculates to “12” and displays “3 x 4=12" right below the prior calculation. User A sees this update immediately after user B posts it.

A live [Demo can be found here](http://52.90.159.226/) hosted on AWS.

### Run Server:
#### `cd src`
#### `node app`

### Build Client:
#### `cd src\client`
#### `yarn build`

### Debug Client:
#### `cd src\client`
#### `yarn start`
