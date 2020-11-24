# A-Frame art for dynamically including in Mozilla Hubs - hackerspace-zone/art

If you clone this tree, you can add custom a-frame components to it.  And then create an html file that will be included for a specific room name, like 6FS98WH.html for hot-coordinated-meetup.  The dynamic.js component will look at the URL to determine the room name and try to fetch that from art.hackerspace.zone/roomname.html to include in the scene.

The html has a pseudo comment that tells it which additional a-frame components to include (since javascript has to be loaded before the html entities).  You can see it in this sample: `https://github.com/hackerspace-zone/art/blob/main/Y4Pugkr.html`

## Local development

If you want to do local development, you can!  Just add`?room=whatever` to your hackerspace.zone URL, and it will override the room name.  If you also add `&host=http://localhost:8000` and serve the files locally, you can make those changes locally. If just serving locally

```https://hackerspace.zone/QfYsW4T/elated-stylish-huddle?host=http://localhost:8000```

## Serving

To serve the files, you should use the serve command in the art directory. `./serve` It provides a CORS header that makes hubs happy.

To make things permanent, you need to send a pull request to the github tree. once pushed to the main branch, it will be served automatically on art.hackerspace.zone

## Features

### Teleport button

New feature for the teleport-button objects - you can make them target things that you've added in spoke.

For instance, if you add a waypoint (it is an object type in the Elements section of assets) in Spoke named `foo` it will be instantiated in the html as an entity with `class="foo"`. You can make a teleport button go to it's position by setting <a-entity teleport-button="target: .foo">...</a-entity>