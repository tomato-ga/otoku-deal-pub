import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalf } from '@fortawesome/free-solid-svg-icons';

export default function StarDisplayComponent({ starCount }) {

    if (starCount) {
        const fullStars = Math.floor(starCount);
        const halfStar = (starCount - fullStars) >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;
    
        return (
            <>
                {[...Array(fullStars)].map((_, i) => <FontAwesomeIcon key={i} icon={faStar} color="orange" size="2x"/>)}
                {[...Array(halfStar)].map((_, i) => <FontAwesomeIcon key={i} icon={faStarHalf} color="orange" size="2x"/>)}
                {[...Array(emptyStars)].map((_, i) => <FontAwesomeIcon key={i} icon={faStar} color="gray" size="2x"/>)}
            </>
        );
    }

}