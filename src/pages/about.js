import Image from 'next/image';
import React, { useState } from 'react';
import logo from "../Image/logo.png";
import GeoLocation from '@/components/Elements/GeoLocation';
import Button from '@/components/UI/Button';

const About = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div className='flex flex-col flex-wrap p-2 m-3 gap-8 sm:gap-24 lg:gap-20 sm:m-5 lg:m-5'>
        <div className='flex flex-col justify-center gap-3'>
          <Image src={logo} className='w-[20%] h-auto self-center lg:mt-10 lg:w-[10%]' alt='The millet store' />
          <h1 className='text-xl font-bold text-gray-900 text-center sm:text-2xl lg:text-2xl underline'>
            The Story of Millet Store
          </h1>
        </div>
        <div className='flex flex-col flex-wrap gap-2'>
          <p>
            Every story has a beginning. Ours began one fine morning with a simple and innocent question posed by my little daughter, &apos;Why does chapatti have no taste, amma?&apos; Taken aback but intrigued, I undertook a year-long journey to understand the food we eat - traditional and modern; and ways to make them even better.
          </p>
          <p>
            After many trials and errors and much experimentation on my family, the perfect atta recipe was finally found. The result was a wide variety of flours that made the everyday rotis different and interesting. Our atta dough is easy to handle and makes amazing rotis that are great in taste and stay soft for up to 12 hours.
          </p>

          {isExpanded && (
            <>
              <p>
                Encouraged by the overwhelming response received from friends and family, I decided to open &apos;The Millet Store&apos; in September 2019. Since then, we have introduced freshly milled flours (rice, ragi, jowar, buckwheat, etc), wood pressed oil (coconut, groundnut and sesame) and jaggery from our own farm.
              </p>
              <p>
                We have also developed our signature attas (Sharbati, Emmer, Fenugreek & Poppy Seeds), Multi-Grain (8 grains), Multi-Millet (5 millets), Methi Masala Atta, Drumstick Leaf Masala Atta and many more.
              </p>
              <p>
                The Millet Store specialises in making ready mixes and special attas, which are easy to use and store. The ingredients are freshly sourced and each product is customised to suit the taste and varying requirements of our customers. If you want it, we can make it!
              </p>
              <p>
                We work diligently to offer you the best in taste, nutrition and convenience. The Millet Store maintains strict hygiene and quality standards to retain the freshness and nutritional content of every single ingredient that we use.
              </p>
              <p>
                Through our products, we hope to re-introduce the wonders and benefits of whole grains and flours and make them equally tempting for all age groups. We understand the nutritional needs of children, adults and seniors; and the practical constraints of a busy schedule, along with the challenges it throws up for healthy home-cooked meals.
              </p>
              <p>
                Our healthy ready mixes and flours lend a helping hand to any home cook who needs it - students, young working adults, fresh cooks or anyone looking to cook up a delicious storm in the kitchen super quick. No preparation, no mess, no cutting, no chopping, no cleaning and no fuss. We assure our customers of fast and easy products, which they can use anytime.
              </p>
              <p>
                The moment you place an order, we get to work procuring fresh organic produce, milling them and packing them under stringent safety measures. We deliver within the time frame we promise. Since we do not add any kind of preservatives, our products have a limited shelf life and must be consumed within the specified date.
              </p>
              <p>
                Our promise is simple - We strive to make food delicious for you and your family.
              </p>
              <p>And our story has only just begun!</p>
              <p>
                We deliver freshly made atta, flours, masala and oil to your doorstep, once a week. Just Call/WhatsApp us on +91 63 62 033 034 for any queries. We would love to hear from you. Your valuable suggestions help us serve you better.
              </p>
              <p>Thanks</p>
              <p>Ponmozhi & Team</p>
            </>
          )}
          <Button
            onClick={toggleReadMore}
            text={isExpanded ? 'Show Less' : 'Read More'}
          />
        </div>
        <div>
          <GeoLocation />
        </div>
      </div>
    </>
  );
};

export default About;
