# garmin-tools

A set of "simple" casperjs automation scripts to access and modify features of Garmin Connect that aren't readily available to the end user.

So far I have a utility for reading out the step count, and posting a weight entry.  Still trying to decipher the API for posting body fat, and manipulating the step count, but for now these are two features I needed for automations outside of Garmin Connect.

Due to some limitations in most packaged versions of casperjs (namely, the inability to post json), you will need to get the latest sources of casperjs from github:

https://github.com/n1k0/casperjs

There's no compiling involved, just a git clone.  phantomjs is a dependency of casperjs, and the packaged versions of phantomjs seem to work just fine.

On osx, you can install phantomjs using homebrew doing a simple `brew install phantomjs`.  On Linux, debian versions seem to have phantomjs available.  `aptitude search phantomjs` to find it and `aptitude install` to get it.
