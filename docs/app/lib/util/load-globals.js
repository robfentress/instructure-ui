import React from 'react'
import ReactDOM from 'react-dom'
import placeholderImage from 'mocks/util/placeholder-image'
import IconComposeSolid from 'instructure-icons/react/Solid/IconComposeSolid'
import avatarImage from 'mocks/images/placeholder-avatar.png'
import lorem from 'lorem-ipsum'

// These need to be globals to render examples
global.placeholderImage = placeholderImage
global.PlaceholderIcon = IconComposeSolid
global.avatarImage = avatarImage
global.React = React
global.ReactDOM = ReactDOM
global.lorem = {
  sentence () {
    return lorem({
      count: 1,
      units: 'sentences'
    })
  },
  paragraph () {
    return lorem({
      count: 1,
      units: 'paragraphs'
    })
  },
  paragraphs (count) {
    return lorem({
      count: count || Math.floor(Math.random() * 10),
      units: 'paragraphs'
    })
  }
}
