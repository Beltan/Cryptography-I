# Cryptography-I-Week-3
Suppose a web site hosts large video file FF that anyone can download. Browsers who download the file need to make sure the file is authentic before displaying the content to the user. One approach is to have the web site hash the contents of FF using a collision resistant hash and then distribute the resulting short hash value h = H(F)h=H(F) to users via some authenticated channel (later on we will use digital signatures for this). Browsers would download the entire file FF, check that H(F)H(F) is equal to the authentic hash value hh and if so, display the video to the user. Unfortunately, this means that the video will only begin playing after the *entire* file FF has been downloaded.

Our goal in this project is to build a file authentication system that lets browsers authenticate and play video chunks as they are downloaded without having to wait for the entire file. Instead of computing a hash of the entire file, the web site breaks the file into 1KB blocks (1024 bytes). It computes the hash of the last block and appends the value to the second to last block. It then computes the hash of this augmented second to last block and appends the resulting hash to the third block from the end. This process continues from the last block to the first
The final hash value h_0h 
0
​	  – a hash of the first block with its appended hash – is distributed to users via the authenticated channel as above.

Now, a browser downloads the file FF one block at a time, where each block includes the appended hash value from the diagram above. When the first block (B_0 \ \big\|\ h_1)(B 
0
​	   
∥
∥
​	  h 
1
​	 ) is received the browser checks that H(B_0\ \big\|\ h_1)H(B 
0
​	   
∥
∥
​	  h 
1
​	 ) is equal to h_0h 
0
​	  and if so it begins playing the first video block. When the second block (B_1\ \big\|\ h_2)(B 
1
​	   
∥
∥
​	  h 
2
​	 ) is received the browser checks that H(B_1\ \|\ h_2)H(B 
1
​	  ∥ h 
2
​	 ) is equal to h_1h 
1
​	  and if so it plays this second block. This process continues until the very last block. This way each block is authenticated and played as it is received and there is no need to wait until the entire file is downloaded.

It is not difficult to argue that if the hash function HH is collision resistant then an attacker cannot modify any of the video blocks without being detected by the browser. Indeed, since h_0 = H(B_0 \ \big\|\ h_1)h 
0
​	 =H(B 
0
​	   
∥
∥
​	  h 
1
​	 ) an attacker cannot find a pair (B′0,h′1)≠(B0,h1) such that h0=H(B′0 ∥∥ h′1) since this would break collision resistance of HH. Therefore after the first hash check the browser is convinced that both B_0B 
0
​	  and h_1h 
1
​	  are authentic. Exactly the same argument proves that after the second hash check the browser is convinced that both B_1B 
1
​	  and h_2h 
2
​	  are authentic, and so on for the remaining blocks.
