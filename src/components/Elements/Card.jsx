import React from 'react'
import {
    Card as CardLayout,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
} from "@material-tailwind/react";
import Image from 'next/image'

const Card = ({ product }) => {
    return (
        <>
            <CardLayout className="w-96">
                <CardHeader shadow={false} floated={false} className="h-96">
                    <Image
                        src={product.image}
                        alt="card-image"
                        className="h-full w-full object-cover"
                    />
                </CardHeader>
                <CardBody>
                    <div className="mb-2 flex items-center justify-between">
                        <Typography color="blue-gray" className="font-medium">
                            {product.name}
                        </Typography>
                        <Typography color="blue-gray" className="font-medium">
                            Rs. {product.price}
                        </Typography>
                    </div>
                    <Typography
                        variant="small"
                        color="gray"
                        className="font-normal opacity-75"
                    >
                        {product.description}
                    </Typography>
                </CardBody>
                <CardFooter className="pt-0">
                    <Button
                        ripple={false}
                        fullWidth={true}
                        className="bg-blue-gray-900/10 text-blue-gray-900 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
                    >
                        Add to Cart
                    </Button>
                </CardFooter>
            </CardLayout>
        </>
    )
}

export default Card
