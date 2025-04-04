import {
    ChevronDownIcon,
    ChevronUpDownIcon,
    ChevronUpIcon,
    EyeIcon,
    EyeSlashIcon,
    FunnelIcon,
    InformationCircleIcon,
    MapIcon
} from '@heroicons/react/24/outline'
import { ArrowDownIcon, TrashIcon } from '@heroicons/react/24/solid'
import axios from 'axios'
import { Fragment, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Select from 'react-tailwindcss-select'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'
import Navbar from '../components/Navbar'
import { AuthContext } from '../context/AuthContext'

const Search = () => {
    const { auth } = useContext(AuthContext)
    const [isOpenFilter, setIsOpenFilter] = useState(true)
    const [isDeletingCheckedShowtimes, setIsDeletingCheckedShowtimes] = useState(false)
    const [deletedCheckedShowtimes, setDeletedCheckedShowtimes] = useState(0)
    const [isReleasingCheckedShowtimes, setIsReleasingCheckedShowtimes] = useState(false)
    const [releasedCheckedShowtimes, setReleasedCheckedShowtimes] = useState(0)
    const [isUnreleasingCheckedShowtimes, setIsUnreleasingCheckedShowtimes] = useState(false)
    const [unreleasedCheckedShowtimes, setUnreleasedCheckedShowtimes] = useState(0)
    const [isFetchingShowtimesDone, setIsFetchingShowtimesDone] = useState(false)

    const [showtimes, setShowtimes] = useState([])
    const [filterCinema, setFilterCinema] = useState(null)
    const [filterTheater, setFilterTheater] = useState(null)
    const [filterMovie, setFilterMovie] = useState(null)
    const [filterDate, setFilterDate] = useState(null)
    const [filterDateFrom, setFilterDateFrom] = useState(null)
    const [filterDateTo, setFilterDateTo] = useState(null)
    const [filterPastDate, setFilterPastDate] = useState(null)
    const [filterToday, setFilterToday] = useState(null)
    const [filterFutureDate, setFilterFutureDate] = useState(null)
    const [filterTime, setFilterTime] = useState(null)
    const [filterTimeFrom, setFilterTimeFrom] = useState(null)
    const [filterTimeTo, setFilterTimeTo] = useState(null)
    const [filterReleaseTrue, setFilterReleaseTrue] = useState(null)
    const [filterReleaseFalse, setFilterReleaseFalse] = useState(null)
    const [isCheckAll, setIsCheckAll] = useState(false)
    const [checkedShowtimes, setCheckedShowtimes] = useState([])

    const [sortCinema, setSortCinema] = useState(0)
    const [sortTheater, setSortTheater] = useState(0)
    const [sortMovie, setSortMovie] = useState(0)
    const [sortDate, setSortDate] = useState(0)
    const [sortTime, setSortTime] = useState(0)
    const [sortBooked, setSortBooked] = useState(0)
    const [sortRelease, setSortRelease] = useState(0)

    const resetSort = () => {
        setSortCinema(0)
        setSortTheater(0)
        setSortMovie(0)
        setSortDate(0)
        setSortTime(0)
        setSortBooked(0)
        setSortRelease(0)
    }

    const filteredShowtimes = showtimes
        .filter((showtime) => {
            if (!showtime.theater || !showtime.theater.cinema || !showtime.movie) {
                return false
            }

            const showtimeDate = new Date(showtime.showtime)
            const year = showtimeDate.getFullYear()
            const month = showtimeDate.toLocaleString('default', { month: 'short' })
            const day = showtimeDate.getDate().toString().padStart(2, '0')
            const formattedDate = `${day} ${month} ${year}`
            const hours = showtimeDate.getHours().toString().padStart(2, '0')
            const minutes = showtimeDate.getMinutes().toString().padStart(2, '0')
            const formattedTime = `${hours} : ${minutes}`

            return (
                (!filterCinema || filterCinema.map((cinema) => cinema.value).includes(showtime.theater.cinema._id)) &&
                (!filterTheater || filterTheater.map((theater) => theater.value).includes(showtime.theater.number)) &&
                (!filterMovie || filterMovie.map((movie) => movie.value).includes(showtime.movie._id)) &&
                (!filterDate || filterDate.map((showtime) => showtime.value).includes(formattedDate)) &&
                (!filterDateFrom || new Date(filterDateFrom.value) <= new Date(formattedDate)) &&
                (!filterDateTo || new Date(filterDateTo.value) >= new Date(formattedDate)) &&
                (!filterPastDate ||
                    new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) >
                    new Date(formattedDate)) &&
                (!filterToday ||
                    (new Date().getFullYear() === new Date(formattedDate).getFullYear() &&
                    new Date().getMonth() === new Date(formattedDate).getMonth() &&
                    new Date().getDate() === new Date(formattedDate).getDate())) &&
                (!filterFutureDate ||
                    new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) <
                    new Date(formattedDate)) &&
                (!filterTime || filterTime.map((showtime) => showtime.value).includes(formattedTime)) &&
                (!filterTimeFrom || filterTimeFrom.value <= formattedTime) &&
                (!filterTimeTo || filterTimeTo.value >= formattedTime) &&
                (!filterReleaseTrue || showtime.isRelease) &&
                (!filterReleaseFalse || !showtime.isRelease)
            )
        })
        .sort((a, b) => {
            if (sortCinema) {
                return sortCinema * (a.theater?.cinema?.name || '').localeCompare(b.theater?.cinema?.name || '')
            }
            if (sortTheater) {
                return sortTheater * ((a.theater?.number || 0) - (b.theater?.number || 0))
            }
            if (sortMovie) {
                return sortMovie * (a.movie?.name || '').localeCompare(b.movie?.name || '')
            }
            if (sortDate) {
                return sortDate * (new Date(a.showtime) - new Date(b.showtime))
            }
            if (sortTime) {
                return (
                    sortTime *
                    ((new Date(a.showtime)
                        .getHours()
                        .toString()
                        .padStart(2, '0')
                        .concat(new Date(a.showtime).getMinutes().toString().padStart(2, '0')) || '0') -
                    (new Date(b.showtime)
                        .getHours()
                        .toString()
                        .padStart(2, '0')
                        .concat(new Date(b.showtime).getMinutes().toString().padStart(2, '0')) || '0'))
                )
            }
            if (sortBooked) {
                return sortBooked * ((a.seats?.length || 0) - (b.seats?.length || 0))
            }
            if (sortRelease) {
                return sortRelease * ((a.isRelease ? 1 : 0) - (b.isRelease ? 1 : 0))
            }
            return 0
        })

    const fetchShowtimes = async (data) => {
        try {
            setIsFetchingShowtimesDone(false)
            let response
            if (auth.role === 'admin') {
                response = await axios.get('/showtime/unreleased', {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                })
            } else {
                response = await axios.get('/showtime')
            }
            
            // Filter out invalid showtimes
            const validShowtimes = response.data.data.filter(
                showtime => showtime.theater && showtime.theater.cinema && showtime.movie
            )
            
            setShowtimes(validShowtimes)
        } catch (error) {
            console.error(error)
            toast.error('Failed to fetch showtimes', {
                position: 'top-center',
                autoClose: 2000,
                pauseOnHover: false
            })
        } finally {
            setIsFetchingShowtimesDone(true)
        }
    }

    useEffect(() => {
        fetchShowtimes()
    }, [])

    const handleDeleteCheckedShowtimes = () => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${checkedShowtimes.length} showtimes? This action cannot be undone.`
        )
        if (confirmed) {
            onDeleteCheckedShowtimes()
        }
    }

    const onDeleteCheckedShowtimes = async () => {
        setIsDeletingCheckedShowtimes(true)
        setDeletedCheckedShowtimes(0)
        let successCounter = 0
        let errorCounter = 0
        const deletePromises = checkedShowtimes.map(async (checkedShowtime) => {
            try {
                const response = await axios.delete(`/showtime/${checkedShowtime}`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                })
                setDeletedCheckedShowtimes((prev) => prev + 1)
                successCounter++
                return response
            } catch (error) {
                console.error(error)
                errorCounter++
            }
        })
        await Promise.all(deletePromises)
        toast.success(`Deleted ${successCounter} showtimes successfully!`, {
            position: 'top-center',
            autoClose: 2000,
            pauseOnHover: false
        })
        errorCounter > 0 &&
            toast.error(`Error deleting ${errorCounter} showtime(s)`, {
                position: 'top-center',
                autoClose: 2000,
                pauseOnHover: false
            })
        resetState()
        fetchShowtimes()
        setIsDeletingCheckedShowtimes(false)
    }

    const handleReleaseCheckedShowtimes = () => {
        const confirmed = window.confirm(`Release ${checkedShowtimes.length} selected showtimes?`)
        if (confirmed) {
            onReleaseCheckedShowtimes()
        }
    }

    const onReleaseCheckedShowtimes = async () => {
        setIsReleasingCheckedShowtimes(true)
        setReleasedCheckedShowtimes(0)
        let successCounter = 0
        let errorCounter = 0
        const releasePromises = checkedShowtimes.map(async (checkedShowtime) => {
            try {
                const response = await axios.put(
                    `/showtime/${checkedShowtime}`,
                    { isRelease: true },
                    {
                        headers: {
                            Authorization: `Bearer ${auth.token}`
                        }
                    }
                )
                setReleasedCheckedShowtimes((prev) => prev + 1)
                successCounter++
                return response
            } catch (error) {
                console.error(error)
                errorCounter++
            }
        })
        await Promise.all(releasePromises)
        toast.success(`Released ${successCounter} showtimes successfully!`, {
            position: 'top-center',
            autoClose: 2000,
            pauseOnHover: false
        })
        errorCounter > 0 &&
            toast.error(`Error releasing ${errorCounter} showtime(s)`, {
                position: 'top-center',
                autoClose: 2000,
                pauseOnHover: false
            })
        resetState()
        fetchShowtimes()
        setIsReleasingCheckedShowtimes(false)
    }

    const handleUnreleasedCheckedShowtimes = () => {
        const confirmed = window.confirm(`Unrelease ${checkedShowtimes.length} selected showtimes?`)
        if (confirmed) {
            onUnreleasedCheckedShowtimes()
        }
    }

    const onUnreleasedCheckedShowtimes = async () => {
        setIsUnreleasingCheckedShowtimes(true)
        setUnreleasedCheckedShowtimes(0)
        let successCounter = 0
        let errorCounter = 0
        const releasePromises = checkedShowtimes.map(async (checkedShowtime) => {
            try {
                const response = await axios.put(
                    `/showtime/${checkedShowtime}`,
                    { isRelease: false },
                    {
                        headers: {
                            Authorization: `Bearer ${auth.token}`
                        }
                    }
                )
                setUnreleasedCheckedShowtimes((prev) => prev + 1)
                successCounter++
                return response
            } catch (error) {
                console.error(error)
                errorCounter++
            }
        })
        await Promise.all(releasePromises)
        toast.success(`Unreleased ${successCounter} showtimes successfully!`, {
            position: 'top-center',
            autoClose: 2000,
            pauseOnHover: false
        })
        errorCounter > 0 &&
            toast.error(`Error unreleasing ${errorCounter} showtime(s)`, {
                position: 'top-center',
                autoClose: 2000,
                pauseOnHover: false
            })
        resetState()
        fetchShowtimes()
        setIsUnreleasingCheckedShowtimes(false)
    }

    const resetState = () => {
        setIsCheckAll(false)
        setCheckedShowtimes([])
    }

    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-[#121212] to-[#1a1a2e] pb-8">
            <Navbar />
            
            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white md:text-4xl">Showtime Management</h1>
                    <p className="text-gray-400 mt-2">Search, filter and manage all showtimes</p>
                </div>

                {/* Filter Section */}
                <div className="mb-6 rounded-xl bg-[#222]/50 p-6 backdrop-blur-sm border border-gray-800 shadow-lg">
                    <div 
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => setIsOpenFilter((prev) => !prev)}
                    >
                        <div className="flex items-center gap-2">
                            <FunnelIcon className="h-6 w-6 text-[#ff416c]" />
                            <h2 className="text-xl font-bold text-white">Filters</h2>
                        </div>
                        {isOpenFilter ? (
                            <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                        ) : (
                            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                        )}
                    </div>

                    {isOpenFilter && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Cinema Filter */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-300 mb-1">Cinema</label>
                                <Select
                                    value={filterCinema}
                                    options={Array.from(
                                        new Set(
                                            showtimes
                                                .filter(showtime => showtime.theater && showtime.theater.cinema)
                                                .map((showtime) => showtime.theater.cinema._id)
                                        )
                                    ).map((value) => ({
                                        value,
                                        label: showtimes.find((showtime) => 
                                            showtime.theater && 
                                            showtime.theater.cinema && 
                                            showtime.theater.cinema._id === value
                                        )?.theater?.cinema?.name || 'Unknown Cinema'
                                    }))}
                                    onChange={(value) => {
                                        setFilterCinema(value)
                                        resetState()
                                    }}
                                    isClearable={true}
                                    isMultiple={true}
                                    isSearchable={true}
                                    primaryColor="red"
                                    classNames={{
                                        menuButton: () => "bg-[#333] border-gray-700 text-white",
                                        menu: "bg-[#333] border-gray-700",
                                        listItem: ({ isSelected }) => 
                                            `text-white hover:bg-[#444] ${isSelected ? "bg-[#ff416c]" : ""}`,
                                    }}
                                />
                            </div>

                            {/* Theater Filter */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-300 mb-1">Theater</label>
                                <Select
                                    value={filterTheater}
                                    options={Array.from(
                                        new Set(
                                            showtimes
                                                .filter(showtime => showtime.theater)
                                                .map((showtime) => showtime.theater.number)
                                        )
                                    )
                                        .sort((a, b) => a - b)
                                        .map((value) => ({
                                            value,
                                            label: value.toString()
                                        }))}
                                    onChange={(value) => {
                                        setFilterTheater(value)
                                        resetState()
                                    }}
                                    isClearable={true}
                                    isMultiple={true}
                                    isSearchable={true}
                                    primaryColor="red"
                                    classNames={{
                                        menuButton: () => "bg-[#333] border-gray-700 text-white",
                                        menu: "bg-[#333] border-gray-700",
                                        listItem: ({ isSelected }) => 
                                            `text-white hover:bg-[#444] ${isSelected ? "bg-[#ff416c]" : ""}`,
                                    }}
                                />
                            </div>

                            {/* Movie Filter */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-300 mb-1">Movie</label>
                                <Select
                                    value={filterMovie}
                                    options={Array.from(
                                        new Set(
                                            showtimes
                                                .filter(showtime => showtime.movie)
                                                .map((showtime) => showtime.movie._id)
                                        )
                                    ).map((value) => ({
                                        value,
                                        label: showtimes.find((showtime) => showtime.movie?._id === value)?.movie?.name || 'Unknown Movie'
                                    }))}
                                    onChange={(value) => {
                                        setFilterMovie(value)
                                        resetState()
                                    }}
                                    isClearable={true}
                                    isMultiple={true}
                                    isSearchable={true}
                                    primaryColor="red"
                                    classNames={{
                                        menuButton: () => "bg-[#333] border-gray-700 text-white",
                                        menu: "bg-[#333] border-gray-700",
                                        listItem: ({ isSelected }) => 
                                            `text-white hover:bg-[#444] ${isSelected ? "bg-[#ff416c]" : ""}`,
                                    }}
                                />
                            </div>

                            {/* Date Range Filter */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-300 mb-1">Date Range</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Select
                                        value={filterDateFrom}
                                        options={Array.from(
                                            new Set(
                                                showtimes.map((showtime) => {
                                                    const showtimeDate = new Date(showtime.showtime)
                                                    const year = showtimeDate.getFullYear()
                                                    const month = showtimeDate.toLocaleString('default', { month: 'short' })
                                                    const day = showtimeDate.getDate().toString().padStart(2, '0')
                                                    return `${day} ${month} ${year}`
                                                })
                                            )
                                        ).map((value) => ({
                                            value,
                                            label: value
                                        }))}
                                        onChange={(value) => {
                                            setFilterDateFrom(value)
                                            resetState()
                                        }}
                                        placeholder="From"
                                        isClearable={true}
                                        isSearchable={true}
                                        primaryColor="red"
                                        classNames={{
                                            menuButton: () => "bg-[#333] border-gray-700 text-white",
                                            menu: "bg-[#333] border-gray-700",
                                            listItem: ({ isSelected }) => 
                                                `text-white hover:bg-[#444] ${isSelected ? "bg-[#ff416c]" : ""}`,
                                        }}
                                    />
                                    <Select
                                        value={filterDateTo}
                                        options={Array.from(
                                            new Set(
                                                showtimes.map((showtime) => {
                                                    const showtimeDate = new Date(showtime.showtime)
                                                    const year = showtimeDate.getFullYear()
                                                    const month = showtimeDate.toLocaleString('default', { month: 'short' })
                                                    const day = showtimeDate.getDate().toString().padStart(2, '0')
                                                    return `${day} ${month} ${year}`
                                                })
                                            )
                                        ).map((value) => ({
                                            value,
                                            label: value
                                        }))}
                                        onChange={(value) => {
                                            setFilterDateTo(value)
                                            resetState()
                                        }}
                                        placeholder="To"
                                        isClearable={true}
                                        isSearchable={true}
                                        primaryColor="red"
                                        classNames={{
                                            menuButton: () => "bg-[#333] border-gray-700 text-white",
                                            menu: "bg-[#333] border-gray-700",
                                            listItem: ({ isSelected }) => 
                                                `text-white hover:bg-[#444] ${isSelected ? "bg-[#ff416c]" : ""}`,
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Time Range Filter */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-300 mb-1">Time Range</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Select
                                        value={filterTimeFrom}
                                        options={Array.from(
                                            new Set(
                                                showtimes.map((showtime) => {
                                                    const showtimeDate = new Date(showtime.showtime)
                                                    const hours = showtimeDate.getHours().toString().padStart(2, '0')
                                                    const minutes = showtimeDate.getMinutes().toString().padStart(2, '0')
                                                    return `${hours} : ${minutes}`
                                                })
                                            )
                                        )
                                            .sort()
                                            .map((value) => ({
                                                value,
                                                label: value
                                            }))}
                                        onChange={(value) => {
                                            setFilterTimeFrom(value)
                                            resetState()
                                        }}
                                        placeholder="From"
                                        isClearable={true}
                                        isSearchable={true}
                                        primaryColor="red"
                                        classNames={{
                                            menuButton: () => "bg-[#333] border-gray-700 text-white",
                                            menu: "bg-[#333] border-gray-700",
                                            listItem: ({ isSelected }) => 
                                                `text-white hover:bg-[#444] ${isSelected ? "bg-[#ff416c]" : ""}`,
                                        }}
                                    />
                                    <Select
                                        value={filterTimeTo}
                                        options={Array.from(
                                            new Set(
                                                showtimes.map((showtime) => {
                                                    const showtimeDate = new Date(showtime.showtime)
                                                    const hours = showtimeDate.getHours().toString().padStart(2, '0')
                                                    const minutes = showtimeDate.getMinutes().toString().padStart(2, '0')
                                                    return `${hours} : ${minutes}`
                                                })
                                            )
                                        )
                                            .sort()
                                            .map((value) => ({
                                                value,
                                                label: value
                                            }))}
                                        onChange={(value) => {
                                            setFilterTimeTo(value)
                                            resetState()
                                        }}
                                        placeholder="To"
                                        isClearable={true}
                                        isSearchable={true}
                                        primaryColor="red"
                                        classNames={{
                                            menuButton: () => "bg-[#333] border-gray-700 text-white",
                                            menu: "bg-[#333] border-gray-700",
                                            listItem: ({ isSelected }) => 
                                                `text-white hover:bg-[#444] ${isSelected ? "bg-[#ff416c]" : ""}`,
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Quick Date Filters */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-300 mb-1">Quick Filters</label>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => {
                                            setFilterPastDate(!filterPastDate)
                                            setFilterToday(false)
                                            setFilterFutureDate(false)
                                            resetState()
                                        }}
                                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                                            filterPastDate 
                                                ? 'bg-[#ff416c] text-white' 
                                                : 'bg-[#333] text-gray-300 hover:bg-[#444]'
                                        }`}
                                    >
                                        Past
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFilterPastDate(false)
                                            setFilterToday(!filterToday)
                                            setFilterFutureDate(false)
                                            resetState()
                                        }}
                                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                                            filterToday 
                                                ? 'bg-[#ff416c] text-white' 
                                                : 'bg-[#333] text-gray-300 hover:bg-[#444]'
                                        }`}
                                    >
                                        Today
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFilterPastDate(false)
                                            setFilterToday(false)
                                            setFilterFutureDate(!filterFutureDate)
                                            resetState()
                                        }}
                                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                                            filterFutureDate 
                                                ? 'bg-[#ff416c] text-white' 
                                                : 'bg-[#333] text-gray-300 hover:bg-[#444]'
                                        }`}
                                    >
                                        Future
                                    </button>
                                </div>
                            </div>

                            {/* Release Status Filter */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-300 mb-1">Release Status</label>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => {
                                            setFilterReleaseTrue(!filterReleaseTrue)
                                            setFilterReleaseFalse(false)
                                            resetState()
                                        }}
                                        className={`px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1 ${
                                            filterReleaseTrue 
                                                ? 'bg-green-600 text-white' 
                                                : 'bg-[#333] text-gray-300 hover:bg-[#444]'
                                        }`}
                                    >
                                        <EyeIcon className="h-4 w-4" />
                                        Released
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFilterReleaseTrue(false)
                                            setFilterReleaseFalse(!filterReleaseFalse)
                                            resetState()
                                        }}
                                        className={`px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1 ${
                                            filterReleaseFalse 
                                                ? 'bg-yellow-600 text-white' 
                                                : 'bg-[#333] text-gray-300 hover:bg-[#444]'
                                        }`}
                                    >
                                        <EyeSlashIcon className="h-4 w-4" />
                                        Unreleased
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="mb-4 flex flex-wrap items-center gap-3">
                    <button
                        onClick={handleReleaseCheckedShowtimes}
                        disabled={checkedShowtimes.length === 0 || isReleasingCheckedShowtimes}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                            checkedShowtimes.length === 0 || isReleasingCheckedShowtimes
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : 'bg-green-700 hover:bg-green-600 text-white'
                        }`}
                    >
                        {isReleasingCheckedShowtimes ? (
                            <span className="flex items-center gap-2">
                                <span className="animate-spin">↻</span>
                                Releasing {releasedCheckedShowtimes}/{checkedShowtimes.length}
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <EyeIcon className="h-5 w-5" />
                                Release ({checkedShowtimes.length})
                            </span>
                        )}
                    </button>

                    <button
                        onClick={handleUnreleasedCheckedShowtimes}
                        disabled={checkedShowtimes.length === 0 || isUnreleasingCheckedShowtimes}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                            checkedShowtimes.length === 0 || isUnreleasingCheckedShowtimes
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : 'bg-yellow-700 hover:bg-yellow-600 text-white'
                        }`}
                    >
                        {isUnreleasingCheckedShowtimes ? (
                            <span className="flex items-center gap-2">
                                <span className="animate-spin">↻</span>
                                Unreleasing {unreleasedCheckedShowtimes}/{checkedShowtimes.length}
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <EyeSlashIcon className="h-5 w-5" />
                                Unrelease ({checkedShowtimes.length})
                            </span>
                        )}
                    </button>

                    <button
                        onClick={handleDeleteCheckedShowtimes}
                        disabled={checkedShowtimes.length === 0 || isDeletingCheckedShowtimes}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                            checkedShowtimes.length === 0 || isDeletingCheckedShowtimes
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : 'bg-red-700 hover:bg-red-600 text-white'
                        }`}
                    >
                        {isDeletingCheckedShowtimes ? (
                            <span className="flex items-center gap-2">
                                <span className="animate-spin">↻</span>
                                Deleting {deletedCheckedShowtimes}/{checkedShowtimes.length}
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <TrashIcon className="h-5 w-5" />
                                Delete ({checkedShowtimes.length})
                            </span>
                        )}
                    </button>

                    <div className="ml-auto flex items-center gap-2 text-sm text-gray-400">
                        <InformationCircleIcon className="h-5 w-5" />
                        Showing {filteredShowtimes.length} showtimes
                    </div>
                </div>

                {/* Showtimes Table */}
                <div className="overflow-hidden rounded-xl border border-gray-800">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-800">
                            <thead className="bg-[#333]">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-12">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-[#ff416c] focus:ring-[#ff416c]"
                                            checked={isCheckAll}
                                            onChange={() => {
                                                if (isCheckAll) {
                                                    setIsCheckAll(false)
                                                    setCheckedShowtimes([])
                                                } else {
                                                    setIsCheckAll(true)
                                                    setCheckedShowtimes(filteredShowtimes.map(showtime => showtime._id))
                                                }
                                            }}
                                        />
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        <button 
                                            className="flex items-center gap-1"
                                            onClick={() => {
                                                let prevValue = sortCinema
                                                resetSort()
                                                setSortCinema(prevValue === 0 ? 1 : prevValue === 1 ? -1 : 0)
                                            }}
                                        >
                                            Cinema
                                            {sortCinema === 0 && <ChevronUpDownIcon className="h-4 w-4" />}
                                            {sortCinema === 1 && <ChevronUpIcon className="h-4 w-4" />}
                                            {sortCinema === -1 && <ChevronDownIcon className="h-4 w-4" />}
                                        </button>
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        <button 
                                            className="flex items-center gap-1"
                                            onClick={() => {
                                                let prevValue = sortTheater
                                                resetSort()
                                                setSortTheater(prevValue === 0 ? 1 : prevValue === 1 ? -1 : 0)
                                            }}
                                        >
                                            Theater
                                            {sortTheater === 0 && <ChevronUpDownIcon className="h-4 w-4" />}
                                            {sortTheater === 1 && <ChevronUpIcon className="h-4 w-4" />}
                                            {sortTheater === -1 && <ChevronDownIcon className="h-4 w-4" />}
                                        </button>
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        <button 
                                            className="flex items-center gap-1"
                                            onClick={() => {
                                                let prevValue = sortMovie
                                                resetSort()
                                                setSortMovie(prevValue === 0 ? 1 : prevValue === 1 ? -1 : 0)
                                            }}
                                        >
                                            Movie
                                            {sortMovie === 0 && <ChevronUpDownIcon className="h-4 w-4" />}
                                            {sortMovie === 1 && <ChevronUpIcon className="h-4 w-4" />}
                                            {sortMovie === -1 && <ChevronDownIcon className="h-4 w-4" />}
                                        </button>
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        <button 
                                            className="flex items-center gap-1"
                                            onClick={() => {
                                                let prevValue = sortDate
                                                resetSort()
                                                setSortDate(prevValue === 0 ? 1 : prevValue === 1 ? -1 : 0)
                                            }}
                                        >
                                            Date
                                            {sortDate === 0 && <ChevronUpDownIcon className="h-4 w-4" />}
                                            {sortDate === 1 && <ChevronUpIcon className="h-4 w-4" />}
                                            {sortDate === -1 && <ChevronDownIcon className="h-4 w-4" />}
                                        </button>
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        <button 
                                            className="flex items-center gap-1"
                                            onClick={() => {
                                                let prevValue = sortTime
                                                resetSort()
                                                setSortTime(prevValue === 0 ? 1 : prevValue === 1 ? -1 : 0)
                                            }}
                                        >
                                            Time
                                            {sortTime === 0 && <ChevronUpDownIcon className="h-4 w-4" />}
                                            {sortTime === 1 && <ChevronUpIcon className="h-4 w-4" />}
                                            {sortTime === -1 && <ChevronDownIcon className="h-4 w-4" />}
                                        </button>
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        <button 
                                            className="flex items-center gap-1"
                                            onClick={() => {
                                                let prevValue = sortBooked
                                                resetSort()
                                                setSortBooked(prevValue === 0 ? 1 : prevValue === 1 ? -1 : 0)
                                            }}
                                        >
                                            Booked
                                            {sortBooked === 0 && <ChevronUpDownIcon className="h-4 w-4" />}
                                            {sortBooked === 1 && <ChevronUpIcon className="h-4 w-4" />}
                                            {sortBooked === -1 && <ChevronDownIcon className="h-4 w-4" />}
                                        </button>
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        <button 
                                            className="flex items-center gap-1"
                                            onClick={() => {
                                                let prevValue = sortRelease
                                                resetSort()
                                                setSortRelease(prevValue === 0 ? 1 : prevValue === 1 ? -1 : 0)
                                            }}
                                        >
                                            Status
                                            {sortRelease === 0 && <ChevronUpDownIcon className="h-4 w-4" />}
                                            {sortRelease === 1 && <ChevronUpIcon className="h-4 w-4" />}
                                            {sortRelease === -1 && <ChevronDownIcon className="h-4 w-4" />}
                                        </button>
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-[#222] divide-y divide-gray-800">
                                {isFetchingShowtimesDone ? (
                                    filteredShowtimes.length > 0 ? (
                                        filteredShowtimes.map((showtime, index) => {
                                            const showtimeDate = new Date(showtime.showtime)
                                            const year = showtimeDate.getFullYear()
                                            const month = showtimeDate.toLocaleString('default', { month: 'short' })
                                            const day = showtimeDate.getDate().toString().padStart(2, '0')
                                            const hours = showtimeDate.getHours().toString().padStart(2, '0')
                                            const minutes = showtimeDate.getMinutes().toString().padStart(2, '0')
                                            const isChecked = checkedShowtimes.includes(showtime._id)

                                            return (
                                                <tr 
                                                    key={index} 
                                                    className={`${isChecked ? 'bg-[#333]' : 'hover:bg-[#333]/50'} transition-colors`}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <input
                                                            type="checkbox"
                                                            className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-[#ff416c] focus:ring-[#ff416c]"
                                                            checked={isChecked}
                                                            onChange={(e) => {
                                                                const { checked } = e.target
                                                                if (checked) {
                                                                    setCheckedShowtimes((prev) => [...prev, showtime._id])
                                                                } else {
                                                                    setCheckedShowtimes((prev) => prev.filter(id => id !== showtime._id))
                                                                }
                                                            }}
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                        {showtime.theater?.cinema?.name || 'Unknown'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                        {showtime.theater?.number || 'Unknown'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                        {showtime.movie?.name || 'Unknown'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                        {`${day} ${month} ${year}`}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                        {`${hours}:${minutes}`}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                        {showtime.seats?.length || 0}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            showtime.isRelease 
                                                                ? 'bg-green-900/50 text-green-300' 
                                                                : 'bg-yellow-900/50 text-yellow-300'
                                                        }`}>
                                                            {showtime.isRelease ? 'Released' : 'Unreleased'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button
                                                            onClick={() => navigate(`/showtime/${showtime._id}`)}
                                                            className="text-[#ff416c] hover:text-[#ff4b2b]"
                                                        >
                                                            View
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-400">
                                                No showtimes found matching your filters
                                            </td>
                                        </tr>
                                    )
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="px-6 py-4 text-center">
                                            <Loading />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Search