# UserFrosting-bower
<h2>Implementing Bower for User frosting</h2>
<p>This is an attempt to create front end framework for user frosting</p>
<p>Still ways to go, but have been able to consolidat the javascript sources and also created a version of the Gruntfile.js. Any  input on how to get this organized properly and get it deployment ready is welcome.</p>
<p>Please dorp me a note if you can help</p>
<p>
See the setup steps document to see all the things that I did to install the NPM modules.
I have not included the Vendor directories here, please run
</p>
<ul>

<li> sudo npm install -g grunt-cli</li>
 <li>sudo npm install grunt-concurrent --save-dev</li>
 <li>sudo npm install grunt-contrib-clean --save-dev</li>
 <li>sudo npm install grunt-contrib-compass --save-dev</li>
 <li>sudo npm install grunt-contrib-concat --save-dev</li>
 <li>sudo npm install grunt-contrib-copy --save-dev</li>
 <li>sudo npm install grunt-contrib-imagemin --save-dev</li>
 <li>sudo npm install grunt-contrib-sass --save-dev</li>
 <li>sudo npm install grunt-newer --save-dev</li>
 <li>sudo npm install grunt-ugly-folders --save-dev</li>
 <li>sudo npm install load-grunt-config --save-dev</li>
 <li>sudo npm install time-grunt --save-dev</li>
</ul>
<p>
bower install
</p>
<p>
I am just experimenting with these. Eventually want to have a way to put it all together for production deployment.
</p>
<ul>
 <li>grunt compass:app
 <li>grunt compass:dist</li>
<li> grunt concat</li>
<li>grunt imagemin</li>
<li>grunt jshint</li>
<li> grunt requir</li>
<li> grunt requirejs</li>
<li> grunt sass</li>
<li> grunt uglify</li>
<li> grunt uglifyFiles</li>
<li> grunt uglyfolders</li>
</ul>
