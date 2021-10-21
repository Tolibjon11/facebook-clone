import React from 'react'
import './Style.css'
import Story from '../Story/Index'
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

const Index = () => {
  const responsive={
    1250:{
      items:4
    },
    560:{
      items:4,
      marginWidth:100
    },
    450:{
      items:3,
      marginWidth:60
    },
    0:{
      items:3,
      marginWidth:2
    }
  }
    return (
        <div className="storyReel">
            <p>Stories</p>
            <OwlCarousel 
              className='owl-theme' 
              items={5}
              responsiveClass={true}
              nav
              marginWidth={40}
              responsive={responsive}
            >
              <div className="item">
                <Story 
                  image="https://blog.iconosquare.com/wp-content/uploads/2019/06/Status-on-Facebook-Stories-min.png"
                  profileSrc='https://avatars2.githubusercontent.com/u/24712956?s=400&u=b71527e605ae1b748fc2d4157a842e57e427add44&v=4'
                  title='Sonny Sangha'
                />
              </div>
              <div className="item">
                <Story 
                  image='https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTBHC2s4NFdzXEsVzvBPGjkrSePQa-8XFuNtQ&usqp=CAU'
                  profileSrc='https://avatars2.githubusercontent.com/u/24712956?s=400&u=b71527e605ae1b748fc2d4157a842e57e427add44&v=4'
                  title='Rafeh Qazi'
                />
              </div>
              <div className="item">
                <Story 
                  image='https://images.unsplash.com/photo-1527082395-e939b847da0d?ixlib=rb-1.2.1&ixid=eyJhcHBfawQiOjEyMDd9&w=1000&q=80'
                  profileSrc='https://avatars2.githubusercontent.com/u/24712956?s=400&u=b71527e605ae1b748fc2d4157a842e57e427add44&v=4'
                  title='Frankie'
                />
              </div>
              <div className="item">
                <Story 
                  image='https://mk0adespressoj4m2p68.kinstacdn.com/wp-content/uploads/2019/11/amazing-example-fb-ig-stories-that-convert-01.jpg'
                  profileSrc='https://avatars2.githubusercontent.com/u/24712956?s=400&u=b71527e605ae1b748fc2d4157a842e57e427add44&v=4'
                  title='Aoran Bernath'
                />
              </div>
              <div className="item">
                <Story 
                  image='https://images.ctfassets.net/az3stxsro5h5/Dnt0B90bCx0YkVLA6uQ0o/94cb5418fec59b28f206e67c7d46f3e1/https___later.com_blog_wp-content_uploads_2019_01_Facebook-Stories-exist-for-a-maximum-of-24-hours.png?w=450&h=800&q=80&fm=png'
                  profileSrc='https://avatars2.githubusercontent.com/u/24712956?s=400&u=b71527e605ae1b748fc2d4157a842e57e427add44&v=4'
                  title='Micheal John'
                />
              </div>
            </OwlCarousel>
        </div>
    )
}

export default Index
