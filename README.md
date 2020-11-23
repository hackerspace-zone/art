# A-Frame art for dynamically including in Mozilla Hubs - hackerspace-zone/art

If you clone this tree, you can add custom a-frame components to it.  And then create an html file that will be included for a specific room name, like 6FS98WH.html for hot-coordinated-meetup.  The dynamic.js component will look at the URL to determine the room name and try to fetch that from art.hackerspace.zone/roomname.html to include in the scene.

The html has a pseudo comment that tells it which additional a-frame components to include (since javascript has to be loaded before the html entities).  You can see it in this sample: https://github.com/hackerspace-zone/art/blob/main/Y4Pugkr.html

### Local development

If you want to do local development, you can!  Just add`?room=whatever` to your hackerspace.zone URL, and it will override the room name.  If you also add `&host=http://localhost:8000` and serve the files locally, you can make those changes locally.

### Serving

to serve the files, you should use the serve command in the art directory.  it provides a CORS header that makes hubs happy.
to make things permanent, you need to send a pull request to the github tree. once pushed to the main branch, it will be served automatically on art.hackerspace.zone