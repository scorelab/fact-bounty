### Setting up oauthd daemon locally

Step 1: Install redis-server using :
        `npm install redis`
       
Step 2: Starting the redis server
        `redis-server --daemonize yes`
       
Step 3: Installing ouathd
        `npm install -g oauthd`
        
Step 4: (in fact bounty folder) 
        `cd fact-bounty-client`
        
Step 5: `oauthd init`

Step 6:  Give your folder a name

Step 7: `cd FOLDER_NAME`

Step 8: `ouathd start`

your screen should look like this when visiting the localhost:6284

![Screenshot 2019-12-20 at 6 37 35 PM](https://user-images.githubusercontent.com/39365087/71256790-dde32800-2357-11ea-8741-6197207e4d2b.png)

<br>
