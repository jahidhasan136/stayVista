import { useState } from 'react';
import AddRoomForm from '../../../components/Form/AddRoomForm';
import useAuth from '../../../hooks/useAuth';
import { imageUpload } from '../../../api/utils';
import { Helmet } from 'react-helmet-async'
import { useMutation } from '@tanstack/react-query'
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AddRoom = () => {
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure()
    const [loading, setLoading] = useState(false)
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
            toast.success("Room Added Successfully")
            navigate('/dashboard/my-listings')
            setLoading(false)
        }
    })

    // Form handler
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
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
                host,
                image: image_url
            }
            console.table(roomData)

            // post request to server
            await mutateAsync(roomData)
        } catch (err) {
            console.log(err)
            toast.error(err.message)

            setLoading(false)
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
            <AddRoomForm dates={dates} handleDates={handleDates} handleSubmit={handleSubmit} setImagePreview={setImagePreview} imagePreview={imagePreview} handleImage={handleImage} imageText={imageText} loading={loading} />
        </>
    );
};

export default AddRoom;