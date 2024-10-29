import { useState } from 'react';
import AddRoomForm from '../../../components/Form/AddRoomForm';
import useAuth from '../../../hooks/useAuth';
import { imageUpload } from '../../../api/utils';
import { Helmet } from 'react-helmet-async'
import { useMutation } from '@tanstack/react-query'
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const AddRoom = () => {
    const axiosSecure = useAxiosSecure()
    const { user } = useAuth();
    const [imagePreview, setImagePreview] = useState();
    const [imageText, setImageText] = useState('Upload Image')
    const [dates, setDates] = useState(
        {
            startDate: new Date(),
            endDate: null,
            key: 'selection'
        }
    )

    // date range handler
    const handleDates = (range) => {
        setDates(range.selection)
    }

    const { mutateAsync } = useMutation({
        mutationFn: async (roomData) => {
            const { data } = await axiosSecure.post('/room', roomData)
            return data;
        },
        onSuccess: () => {
            console.log('Data Saved Succesfully')
        }
    })

    // Form handler
    const handleSubmit = async (e) => {
        e.preventDefault()
        const form = e.target
        const location = form.location.value
        const category = form.category.value
        const title = form.title.value
        const to = dates.endDate
        const from = dates.startDate
        const price = form.price.value
        const bathrooms = form.bathrooms.value
        const description = form.description.value
        const bedrooms = form.bedrooms.value
        const image = form.image.files[0]
        const host = {
            name: user?.displayName,
            image: user?.photoURL,
            email: user?.email
        }

        try {

            const image_url = await imageUpload(image)
            const roomData = {
                location,
                category,
                title,
                to,
                from,
                price,
                bathrooms,
                description,
                bedrooms,
                image: image_url
            }
            console.table(roomData)

            // post request to server
            await mutateAsync(roomData)
        } catch (err) {
            console.log(err)
        }
    }

    // handle image change
    const handleImage = (image) => {
        setImagePreview(URL.createObjectURL(image))
        setImageText(image.name)
    }
    return (
        <>
            <Helmet>
                <title>Add Room | Dashboard</title>
            </Helmet>
            {/* Form */}
            <AddRoomForm dates={dates} handleDates={handleDates} handleSubmit={handleSubmit} setImagePreview={setImagePreview} imagePreview={imagePreview} handleImage={handleImage} imageText={imageText} />
        </>
    );
};

export default AddRoom;