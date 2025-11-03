import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { LuPlus } from 'react-icons/lu'
import type { Address, Item } from '../types'
import * as store from '../storage/local'
import { ItemModal } from '../components/itemModal'
import { ItemDetailModal } from '../components/ItemDetailModal'
import { ListView, GridView, CompactView } from '../components/views/index'
import {
    ActionBar,
    Button,
    Input,
    Slider,
    Box,
    VStack,
    HStack,
    Text,
    Flex,
    Badge,
    Tabs,
    Separator,
    Heading,
    IconButton,
    Drawer,
    DrawerHeader,
    DrawerBody,
    NumberInput,
    Field,
    Portal,
    CloseButton,
    Dialog,
    Pagination
} from '@chakra-ui/react'
import { LuFilter, LuGrip, LuList, LuColumns2, LuSettings, LuX, LuTrash2, LuChevronLeft, LuChevronRight } from 'react-icons/lu'

type Selection = 'all' | '' | string // '' => Unlocated, string => addressId

interface HomePageProps {
    // routeMode controls whether the component syncs its selection state with the URL route, default to 'sync'
    routeMode?: 'sync' | 'local'
}

export default function HomePage({ routeMode = 'sync' }: HomePageProps) {
    const params = useParams<{ addressId?: string }>()
    const navigate = useNavigate()
    const [addresses, setAddresses] = useState<Address[]>([])
    const [selected, setSelected] = useState<Selection>('all')
    const [items, setItems] = useState<Item[]>([])
    const [q, setQ] = useState('')
    // filters
    const [minPriceCents, setMinPriceCents] = useState<number | null>(() => {
        const v = localStorage.getItem('min_price_v1')
        return v ? Number(v) : null
    })
    const [maxPriceCents, setMaxPriceCents] = useState<number | null>(() => {
        const v = localStorage.getItem('max_price_v1')
        return v ? Number(v) : null
    })
    // item creation handled via modal
    const [modalOpen, setModalOpen] = useState(false)
    const [editTarget, setEditTarget] = useState<Item | null>(null)
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
    const [view, setView] = useState<'list' | 'grid' | 'column4'>(() => {
        const v = localStorage.getItem('view_mode_v1')
        return v === 'list' || v === 'grid' || v === 'column4' ? v : 'list'
    })
    const [detailOpen, setDetailOpen] = useState(false)
    const [detailItem, setDetailItem] = useState<Item | null>(null)
    const [multiSelect, setMultiSelect] = useState(false)
    const [filtersOpen, setFiltersOpen] = useState(false)

    // debugging state changes, remove later
    useEffect(() => {
        console.log('multiSelect state changed to:', multiSelect)
    }, [multiSelect])

    useEffect(() => {
        console.log('filtersOpen state changed to:', filtersOpen)
    }, [filtersOpen])
    const [sort, setSort] = useState<'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'date-desc' | 'date-asc'>(() => {
        const v = localStorage.getItem('sort_v1')
        return (v as any) || 'name-asc'
    })
    const [tagFilter, setTagFilter] = useState<string>(() => localStorage.getItem('tag_v1') ?? '')
    const [showSticky, setShowSticky] = useState(false)
    const [moveTarget, setMoveTarget] = useState<Selection>('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const itemsPerPage = 50

    useEffect(() => {
        const res = store.listAddresses()
        setAddresses(res.items)
    }, [])

    useEffect(() => {
        if (routeMode !== 'sync') return
        const routeId = params.addressId
        if (routeId === undefined) {
            setSelected('all')
            return
        }
        if (routeId === 'unlocated') {
            setSelected('')
            return
        }
        setSelected(routeId)
    }, [params.addressId, routeMode])

    useEffect(() => {
        if (selected === 'all') {
            const res = store.listItems({ q, page: currentPage, pageSize: itemsPerPage })
            setItems(res.items)
            setTotalItems(res.total)
        } else {
            const res = store.listItems({ q, addressId: selected, page: currentPage, pageSize: itemsPerPage })
            setItems(res.items)
            setTotalItems(res.total)
        }
        setSelectedItems(new Set())
    }, [selected, q, currentPage, itemsPerPage])

    useEffect(() => {
        setCurrentPage(1)
    }, [selected, q])

    function selectAddress(sel: Selection) {
        setSelected(sel)
        if (routeMode === 'sync') {
            const route = sel === 'all' ? '/addresses' : sel === '' ? '/addresses/unlocated' : `/addresses/${sel}`
            navigate(route)
        }
    }

    function createAddress() {
        const label = window.prompt('Address label')
        if (!label) return
        const created = store.createAddress({ label: label.trim() })
        setAddresses((prev) => [created, ...prev])
        setSelected(created.id)
    }

    function deleteAddress(id: string) {
        store.deleteAddress(id)
        setAddresses((prev) => prev.filter((a) => a.id !== id))
        if (selected === id) setSelected('all')
    }

    function renameAddress(address: Address) {
        const next = window.prompt('Rename address', address.label)
        if (next == null) return
        const updated = store.updateAddress(address.id, { label: next.trim() })
        if (updated) setAddresses((prev) => prev.map((a) => (a.id === address.id ? updated : a)))
    }

    function createItemFromModal(data: Partial<Item>) {
        const payload: Partial<Item> = {
            ...data,
            addressId: data.addressId ?? (selected === 'all' ? undefined : selected || undefined),
        }
        const created = store.createItem(payload)
        setItems((prev) => [created, ...prev])
    }

    function deleteItem(id: string) {
        store.deleteItem(id)
        setItems((prev) => prev.filter((i) => i.id !== id))
    }

    function openEdit(item: Item) {
        setEditTarget(item)
        setModalOpen(true)
    }

    function saveEdit(data: Partial<Item>) {
        if (!editTarget) return
        const updated = store.updateItem(editTarget.id, data)
        if (updated) setItems((prev) => prev.map((i) => (i.id === editTarget.id ? updated : i)))
    }

    function openDetail(item: Item) {
        setDetailItem(item)
        setDetailOpen(true)
    }

    // Persist view mode in local storage for now
    useEffect(() => {
        try { localStorage.setItem('view_mode_v1', view) } catch { }
    }, [view])

    // show sticky breadcrumbs only after scrolling a bit
    useLayoutEffect(() => {
        let lastValue = false
        const onScroll = () => {
            const shouldShow = window.scrollY > 30
            if (shouldShow !== lastValue) {
                lastValue = shouldShow
                setShowSticky(shouldShow)
            }
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        const initialValue = window.scrollY > 30
        lastValue = initialValue
        setShowSticky(initialValue)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // Persist filters in local storage for now
    useEffect(() => {
        try {
            if (minPriceCents == null) localStorage.removeItem('min_price_v1')
            else localStorage.setItem('min_price_v1', String(minPriceCents))
            if (maxPriceCents == null) localStorage.removeItem('max_price_v1')
            else localStorage.setItem('max_price_v1', String(maxPriceCents))
        } catch { }
    }, [minPriceCents, maxPriceCents])
    useEffect(() => {
        try { localStorage.setItem('sort_v1', sort) } catch { }
    }, [sort])
    useEffect(() => {
        try { localStorage.setItem('tag_v1', tagFilter) } catch { }
    }, [tagFilter])


    // listen for nav search changes and mirror into q
    useEffect(() => {
        const handler = (e: Event) => {
            const q = (e as CustomEvent<string>).detail
            setQ(q)
        }
        window.addEventListener('global-search-change', handler as EventListener)
        // fallback: listen directly to the nav input
        const inputEl = document.querySelector('.nav-search input') as HTMLInputElement | null
        const onInput = (ev: Event) => {
            const v = (ev.target as HTMLInputElement).value
            setQ(v)
        }
        if (inputEl) {
            inputEl.addEventListener('input', onInput)
            if (inputEl.value) setQ(inputEl.value)
        }
        return () => {
            window.removeEventListener('global-search-change', handler as EventListener)
            if (inputEl) inputEl.removeEventListener('input', onInput)
        }
    }, [])

    const [minPossible, setMinPossible] = useState(0)
    const [maxPossible, setMaxPossible] = useState(0)
    const [hasPrices, setHasPrices] = useState(false)
    useEffect(() => {
        const resAll = selected === 'all'
            ? store.listItems()
            : store.listItems({ addressId: selected })
        const vals = resAll.items
            .map((i) => i.purchasePriceCents)
            .filter((v): v is number => typeof v === 'number')
        if (vals.length) {
            setHasPrices(true)
            setMinPossible(Math.min(...vals))
            setMaxPossible(Math.max(...vals))
        } else {
            setHasPrices(false)
            setMinPossible(0)
            setMaxPossible(999900)
        }
    }, [selected])

    useEffect(() => {
        if (!hasPrices) {
            setMinPriceCents(null)
            setMaxPriceCents(null)
            return
        }
        setMinPriceCents((prev) => {
            if (prev == null) return null
            return Math.max(minPossible, Math.min(prev, maxPossible))
        })
        setMaxPriceCents((prev) => {
            if (prev == null) return null
            return Math.min(maxPossible, Math.max(prev, minPossible))
        })
    }, [minPossible, maxPossible, hasPrices])

    // Bulk actions
    const anySelected = selectedItems.size > 0
    const toggleItem = (id: string) => setSelectedItems((prev) => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
    })

    const displayItems = useMemo(() => {
        const filteredByPrice = items.filter((i) => {
            const price = i.purchasePriceCents
            if (hasPrices) {
                const min = minPriceCents ?? minPossible
                const max = maxPriceCents ?? maxPossible
                if (price !== undefined) {
                    if (price < min || price > max) return false
                } else {
                    // if item has no price, exclude when a range is active
                    if (min > minPossible || max < maxPossible) return false
                }
            }
            return true
        })
        const filteredByTag = tagFilter.trim()
            ? filteredByPrice.filter((i) => (i.tags ?? []).some((t) => t.toLowerCase().includes(tagFilter.trim().toLowerCase())))
            : filteredByPrice
        const sorted = [...filteredByTag].sort((a, b) => {
            switch (sort) {
                case 'name-asc': return a.name.localeCompare(b.name)
                case 'name-desc': return b.name.localeCompare(a.name)
                case 'price-asc': return (a.purchasePriceCents ?? Infinity) - (b.purchasePriceCents ?? Infinity)
                case 'price-desc': return (b.purchasePriceCents ?? -Infinity) - (a.purchasePriceCents ?? -Infinity)
                case 'date-asc': return (new Date(a.purchaseDate ?? '1900-01-01').getTime()) - (new Date(b.purchaseDate ?? '1900-01-01').getTime())
                case 'date-desc': return (new Date(b.purchaseDate ?? '1900-01-01').getTime()) - (new Date(a.purchaseDate ?? '1900-01-01').getTime())
            }
        })
        return sorted
    }, [items, hasPrices, minPriceCents, maxPriceCents, minPossible, maxPossible, tagFilter, sort])


    // Keyboard shortcuts (after displayItems definition)
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (filtersOpen) { setFiltersOpen(false); e.preventDefault(); return }
                if (multiSelect) { setMultiSelect(false); setSelectedItems(new Set()); e.preventDefault(); return }
            }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [multiSelect, displayItems])

    function bulkDelete() {
        if (!anySelected) return
        store.bulkDeleteItems(Array.from(selectedItems))
        setItems((prev) => prev.filter((i) => !selectedItems.has(i.id)))
        setSelectedItems(new Set())
    }


    function bulkMove(target: Selection) {
        const targetAddressId = target === 'all' ? undefined : target || undefined
        setItems((prev) => prev.map((i) => {
            if (!selectedItems.has(i.id)) return i
            const updated = store.updateItem(i.id, { addressId: targetAddressId })
            return updated ?? i
        }))
        setSelectedItems(new Set())
    }

    return (
        <Box textAlign="left" w="full">
            {/* Sticky breadcrumbs bar visible when scrolling */}
            <Box
                className='app-header app-header-sticky'
                position="fixed"
                top="0"
                left="0"
                right="0"
                width="100%"
                zIndex={1100}
                bg="white"
                borderBottom="1px solid"
                borderColor="border.muted"
                shadow="sm"
                overflowX="hidden"
                display={showSticky ? 'block' : 'none'}
            >
                <div className="container">
                    <nav className="nav">
                        <div className="nav-group nav-breadcrumbs">
                            <Text fontSize="sm" color="fg.muted" lineClamp={1}>
                                Addresses · {selected === 'all' ? 'All items' : (selected === '' ? 'Unlocated' : (addresses.find(a => a.id === selected)?.label ?? ''))}
                            </Text>
                        </div>
                        <div className="nav-group nav-add-item">
                            <Button variant="ghost" size="lg" onClick={() => { setEditTarget(null); setModalOpen(true) }}>
                                <LuPlus size={20} /> Add item
                            </Button>
                        </div>
                    </nav>
                </div>
            </Box>

            <Box py={10}>
                <VStack gap={{ base: 4, md: 8 }} align="stretch" maxW="1400px" mx="auto">
                    {/* Page header */}
                    <Box bg="white" p={{ base: 4, md: 6 }} rounded="xl" shadow="sm" border="1px solid" borderColor="border.muted">
                        <Flex justify="space-between" align="flex-start" gap={{ base: 4, md: 6 }} direction={{ base: 'column', md: 'row' }}>
                            <VStack align="flex-start" gap={3}>
                                <Heading size={{ base: 'lg', md: 'xl' }} fontWeight="bold" color="fg.emphasized">
                                    {selected === 'all' ? 'All items' : (selected === '' ? 'Unlocated items' : (addresses.find(a => a.id === selected)?.label ?? 'Items'))}
                                </Heading>
                                <HStack gap={3} wrap="wrap">
                                    <Text fontSize="md" color="fg.muted" fontWeight="medium">
                                        {totalItems} {totalItems === 1 ? 'item' : 'items'}
                                    </Text>
                                    {tagFilter && (
                                        <Badge colorPalette="blue" variant="subtle" gap={2} px={3} py={1} rounded="full" backgroundColor="blue.50" color="blue.700">
                                            Tag: {tagFilter}
                                            <IconButton
                                                size="xs"
                                                variant="ghost"
                                                onClick={() => setTagFilter('')}
                                            >
                                                <LuX size={12} />
                                            </IconButton>
                                        </Badge>
                                    )}
                                    {((minPriceCents != null && minPriceCents > minPossible) || (maxPriceCents != null && maxPriceCents < maxPossible)) && (
                                        <Badge colorPalette="green" variant="subtle" gap={2} px={3} py={1} rounded="full" backgroundColor="green.50" color="green.700">
                                            Price: ${((minPriceCents ?? minPossible) / 100).toFixed(0)} - ${((maxPriceCents ?? maxPossible) / 100).toFixed(0)}
                                            <IconButton
                                                size="xs"
                                                variant="ghost"
                                                onClick={() => { setMinPriceCents(null); setMaxPriceCents(null) }}
                                            >
                                                <LuX size={12} />
                                            </IconButton>
                                        </Badge>
                                    )}
                                </HStack>
                            </VStack>
                            <HStack gap={2} wrap="wrap">
                                <Button
                                    variant="ghost"
                                    size={{ base: 'md', md: 'lg' }}
                                    onClick={createAddress}
                                    title="Add address"
                                    aria-label="Add address"
                                    colorPalette="gray"
                                >
                                    + Add address
                                </Button>
                                {selected !== 'all' && selected !== '' && (
                                    <>
                                        <Button
                                            variant="outline"
                                            size={{ base: 'md', md: 'lg' }}
                                            onClick={() => { const addr = addresses.find(a => a.id === selected); if (addr) renameAddress(addr) }}
                                        >
                                            Rename
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size={{ base: 'md', md: 'lg' }}
                                            colorPalette="red"
                                            onClick={() => deleteAddress(selected)}
                                        >
                                            Delete
                                        </Button>
                                    </>
                                )}
                            </HStack>
                        </Flex>
                    </Box>
                    {/* Address tabs */}
                    <Box bg="white" p={{ base: 2, md: 4 }} rounded="xl" shadow="sm" border="1px solid" borderColor="border.muted" overflowX="auto">
                        <Tabs.Root value={selected} onValueChange={(e) => selectAddress(e.value as Selection)}>
                            <Tabs.List gap={2} flexWrap={{ base: 'nowrap', md: 'wrap' }} minW={{ base: 'max-content', md: 'auto' }}>
                                <Tabs.Trigger value="all" px={{ base: 3, md: 4 }} py={2} rounded="lg" fontWeight="medium" fontSize={{ base: 'sm', md: 'md' }}>All items</Tabs.Trigger>
                                <Tabs.Trigger value="" px={{ base: 3, md: 4 }} py={2} rounded="lg" fontWeight="medium" fontSize={{ base: 'sm', md: 'md' }}>Unlocated</Tabs.Trigger>
                                {addresses.map((a) => (
                                    <Tabs.Trigger key={a.id} value={a.id} px={{ base: 3, md: 4 }} py={2} rounded="lg" fontWeight="medium" fontSize={{ base: 'sm', md: 'md' }}>
                                        <HStack gap={1}>
                                            <Text>{a.label}</Text>
                                            {(a.sharedWith?.length ?? 0) > 0 && (
                                                <Badge size="sm" colorPalette="blue" rounded="full">
                                                    {a.sharedWith!.length}
                                                </Badge>
                                            )}
                                        </HStack>
                                    </Tabs.Trigger>
                                ))}

                            </Tabs.List>
                        </Tabs.Root>
                    </Box>
                    {/* Toolbar */}
                    <Box bg="white" p={{ base: 3, md: 4 }} rounded="xl" shadow="sm" border="1px solid" borderColor="border.muted">
                        <Flex justify="space-between" align="center" gap={{ base: 3, md: 6 }} wrap="wrap">
                            <HStack gap={{ base: 1, md: 2 }} role="group" aria-label="View mode" wrap="wrap">
                                <IconButton
                                    variant={view === 'grid' ? 'solid' : 'outline'}
                                    size={{ base: 'md', md: 'lg' }}
                                    onClick={() => setView('grid')}
                                    title="Grid"
                                    aria-label="Grid"
                                    aria-pressed={view === 'grid'}
                                    colorPalette={view === 'grid' ? 'blue' : 'gray'}
                                >
                                    <LuGrip size={20} />
                                </IconButton>
                                <IconButton
                                    variant={view === 'column4' ? 'solid' : 'outline'}
                                    size={{ base: 'md', md: 'lg' }}
                                    onClick={() => setView('column4')}
                                    title="Column 4"
                                    aria-label="Columns"
                                    aria-pressed={view === 'column4'}
                                    colorPalette={view === 'column4' ? 'blue' : 'gray'}
                                >
                                    <LuColumns2 size={20} />
                                </IconButton>
                                <IconButton
                                    variant={view === 'list' ? 'solid' : 'outline'}
                                    size={{ base: 'md', md: 'lg' }}
                                    onClick={() => setView('list')}
                                    title="List"
                                    aria-label="List"
                                    aria-pressed={view === 'list'}
                                    colorPalette={view === 'list' ? 'blue' : 'gray'}
                                >
                                    <LuList size={20} />
                                </IconButton>
                                <Button
                                    variant={multiSelect ? "solid" : "outline"}
                                    size={{ base: 'md', md: 'lg' }}
                                    colorPalette={multiSelect ? 'blue' : 'gray'}
                                    onClick={() => {
                                        console.log('Select button clicked, toggling multiSelect from', multiSelect, 'to', !multiSelect)
                                        setMultiSelect(!multiSelect)
                                    }}
                                >
                                    <LuSettings size={18} />
                                </Button>
                                <Button
                                    variant="outline"
                                    size={{ base: 'md', md: 'lg' }}
                                    colorPalette="blue"
                                    onClick={() => setFiltersOpen(true)}
                                    display={{ base: 'flex', md: 'none' }}
                                >
                                    <LuFilter size={18} />
                                </Button>
                                <Button
                                    onClick={() => { setEditTarget(null); setModalOpen(true) }}
                                    size={{ base: 'md', md: 'lg' }}
                                    colorPalette="blue"
                                    shadow="md"
                                >
                                    + Add item
                                </Button>
                            </HStack>

                            {/* Desktop filters row */}
                            <HStack gap={4} display={{ base: 'none', md: 'flex' }}>
                                <Field.Root width="auto">
                                    <Field.Label fontSize="sm" color="fg.muted" mb={2} fontWeight="medium">Sort</Field.Label>
                                    <select
                                        value={sort}
                                        onChange={(e) => setSort(e.target.value as typeof sort)}
                                        style={{
                                            padding: '12px 16px',
                                            border: '1px solid var(--chakra-colors-border-muted)',
                                            borderRadius: '8px',
                                            backgroundColor: 'var(--chakra-colors-bg)',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            minWidth: '180px'
                                        }}
                                    >
                                        <option value="name-asc">Name (A→Z)</option>
                                        <option value="name-desc">Name (Z→A)</option>
                                        <option value="price-asc">Price (low→high)</option>
                                        <option value="price-desc">Price (high→low)</option>
                                        <option value="date-desc">Date (newest)</option>
                                        <option value="date-asc">Date (oldest)</option>
                                    </select>
                                </Field.Root>

                                <Field.Root width="auto">
                                    <Field.Label fontSize="sm" color="fg.muted" mb={2} fontWeight="medium">Tag</Field.Label>
                                    <Input
                                        value={tagFilter}
                                        onChange={(e) => setTagFilter(e.target.value)}
                                        placeholder="e.g. kitchen"
                                        width="200px"
                                        size="md"
                                    />
                                </Field.Root>

                                {(tagFilter || (minPriceCents != null) || (maxPriceCents != null)) && (
                                    <Button
                                        variant="outline"
                                        size="md"
                                        colorPalette="gray"
                                        onClick={() => { setTagFilter(''); setMinPriceCents(null); setMaxPriceCents(null) }}
                                    >
                                        Clear
                                    </Button>
                                )}
                            </HStack>
                        </Flex>
                    </Box>

                    {/* Filters Drawer */}
                    <Drawer.Root open={filtersOpen} onOpenChange={(e) => setFiltersOpen(e.open)}>
                        <Drawer.Backdrop />
                        <Drawer.Positioner>
                            <Drawer.Content maxW="400px" h="100vh">
                                <DrawerHeader>
                                    <Heading size="md">Filters & Sort</Heading>
                                    <Button variant="ghost" size="lg" onClick={() => setFiltersOpen(false)}>
                                        <LuX size={20} />
                                    </Button>
                                </DrawerHeader>
                                <DrawerBody>
                                    <VStack gap={6} align="stretch">
                                        {/* Sort */}
                                        <Box>
                                            <Text fontWeight="semibold" mb={3}>Sort by</Text>
                                            <Field.Root>
                                                <select
                                                    value={sort}
                                                    onChange={(e) => setSort(e.target.value as typeof sort)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px 16px',
                                                        border: '1px solid var(--chakra-colors-border-muted)',
                                                        borderRadius: '8px',
                                                        backgroundColor: 'var(--chakra-colors-bg)',
                                                        fontSize: '14px',
                                                        fontWeight: '500',
                                                    }}
                                                >
                                                    <option value="name-asc">Name (A→Z)</option>
                                                    <option value="name-desc">Name (Z→A)</option>
                                                    <option value="price-asc">Price (low→high)</option>
                                                    <option value="price-desc">Price (high→low)</option>
                                                    <option value="date-desc">Date (newest)</option>
                                                    <option value="date-asc">Date (oldest)</option>
                                                </select>
                                            </Field.Root>
                                        </Box>

                                        {/* Tag Filter */}
                                        <Box>
                                            <Text fontWeight="semibold" mb={3}>Filter by tag</Text>
                                            <Field.Root>
                                                <Input
                                                    value={tagFilter}
                                                    onChange={(e) => setTagFilter(e.target.value)}
                                                    placeholder="e.g. kitchen"
                                                    size="md"
                                                />
                                            </Field.Root>
                                        </Box>

                                        {/* Price Range */}
                                        <Box>
                                            <Text fontWeight="semibold" mb={3}>Price range</Text>
                                            <VStack gap={4}>
                                                <Field.Root>
                                                    <Field.Label fontSize="sm" color="fg.muted">Min</Field.Label>
                                                    <NumberInput.Root
                                                        value={((minPriceCents ?? minPossible) / 100).toFixed(2)}
                                                        onValueChange={(e) => {
                                                            const v = Number(e.value)
                                                            if (Number.isNaN(v)) return
                                                            const cents = Math.round(v * 100)
                                                            const clamped = Math.max(minPossible, Math.min(cents, (maxPriceCents ?? maxPossible)))
                                                            setMinPriceCents(clamped)
                                                        }}
                                                        step={0.01}
                                                    >
                                                        <NumberInput.Control />
                                                        <NumberInput.Input />
                                                    </NumberInput.Root>
                                                </Field.Root>

                                                <Box py={2} w="full">
                                                    <Slider.Root
                                                        min={minPossible}
                                                        max={maxPossible}
                                                        step={100}
                                                        value={[minPriceCents ?? minPossible, maxPriceCents ?? maxPossible]}
                                                        onValueChange={(e) => {
                                                            const [lo, hi] = e.value
                                                            setMinPriceCents(lo)
                                                            setMaxPriceCents(hi)
                                                        }}
                                                        aria-label={["Minimum price", "Maximum price"]}
                                                    >
                                                        <Slider.Control>
                                                            <Slider.Track bg="gray.200" h="8px" rounded="full">
                                                                <Slider.Range bg="blue.500" rounded="full" />
                                                            </Slider.Track>
                                                            <Slider.Thumb index={0} w="20px" h="20px" bg="blue.500" border="2px solid" borderColor="white" shadow="md" />
                                                            <Slider.Thumb index={1} w="20px" h="20px" bg="blue.500" border="2px solid" borderColor="white" shadow="md" />
                                                        </Slider.Control>
                                                    </Slider.Root>
                                                </Box>

                                                <Field.Root>
                                                    <Field.Label fontSize="sm" color="fg.muted">Max</Field.Label>
                                                    <NumberInput.Root
                                                        value={((maxPriceCents ?? maxPossible) / 100).toFixed(2)}
                                                        onValueChange={(e) => {
                                                            const v = Number(e.value)
                                                            if (Number.isNaN(v)) return
                                                            const cents = Math.round(v * 100)
                                                            const clamped = Math.min(maxPossible, Math.max(cents, (minPriceCents ?? minPossible)))
                                                            setMaxPriceCents(clamped)
                                                        }}
                                                        step={0.01}
                                                    >
                                                        <NumberInput.Control />
                                                        <NumberInput.Input />
                                                    </NumberInput.Root>
                                                </Field.Root>
                                            </VStack>
                                        </Box>

                                        {(tagFilter || (minPriceCents != null) || (maxPriceCents != null)) && (
                                            <Button
                                                variant="outline"
                                                colorPalette="gray"
                                                onClick={() => { setTagFilter(''); setMinPriceCents(null); setMaxPriceCents(null) }}
                                            >
                                                Clear all filters
                                            </Button>
                                        )}
                                    </VStack>
                                </DrawerBody>
                            </Drawer.Content>
                        </Drawer.Positioner>
                    </Drawer.Root>
                    <Separator />


                    {/* Items display based on view mode */}
                    {view === 'grid' && (
                        <GridView
                            items={displayItems}
                            addresses={addresses}
                            selectedItems={selectedItems}
                            multiSelect={multiSelect}
                            onItemClick={openDetail}
                            onToggleItem={toggleItem}
                            onSelectAll={(checked) => {
                                if (checked) {
                                    setSelectedItems(new Set(displayItems.map(i => i.id)))
                                } else {
                                    setSelectedItems(new Set())
                                }
                            }}
                        />
                    )}
                    {view === 'column4' && (
                        <CompactView
                            items={displayItems}
                            addresses={addresses}
                            selectedItems={selectedItems}
                            multiSelect={multiSelect}
                            onItemClick={openDetail}
                            onToggleItem={toggleItem}
                            onSelectAll={(checked) => {
                                if (checked) {
                                    setSelectedItems(new Set(displayItems.map(i => i.id)))
                                } else {
                                    setSelectedItems(new Set())
                                }
                            }}
                        />
                    )}
                    {view === 'list' && (
                        <ListView
                            items={displayItems}
                            addresses={addresses}
                            selectedItems={selectedItems}
                            multiSelect={multiSelect}
                            onItemClick={openDetail}
                            onToggleItem={toggleItem}
                            onSelectAll={(checked) => {
                                if (checked) {
                                    setSelectedItems(new Set(displayItems.map(i => i.id)))
                                } else {
                                    setSelectedItems(new Set())
                                }
                            }}
                        />
                    )}

                    {/* Pagination */}
                    {totalItems > itemsPerPage && (
                        <Box display="flex" justifyContent="center" py={6}>
                            <Pagination.Root
                                count={totalItems}
                                pageSize={itemsPerPage}
                                page={currentPage}
                                onPageChange={(e) => setCurrentPage(e.page)}
                            >
                                <HStack gap={2}>
                                    <Pagination.PrevTrigger asChild>
                                        <IconButton size="sm" variant="outline">
                                            <LuChevronLeft />
                                        </IconButton>
                                    </Pagination.PrevTrigger>

                                    <Pagination.Items
                                        render={(page) => (
                                            <IconButton
                                                size="sm"
                                                variant={{ base: "outline", _selected: "solid" }}
                                                colorPalette="blue"
                                            >
                                                {page.value}
                                            </IconButton>
                                        )}
                                    />

                                    <Pagination.NextTrigger asChild>
                                        <IconButton size="sm" variant="outline">
                                            <LuChevronRight />
                                        </IconButton>
                                    </Pagination.NextTrigger>
                                </HStack>
                            </Pagination.Root>
                        </Box>
                    )}

                    <ItemModal
                        open={modalOpen}
                        mode={editTarget ? 'edit' : 'create'}
                        addresses={addresses}
                        initial={editTarget ?? { addressId: selected === 'all' ? undefined : selected || undefined }}
                        onCancel={() => setModalOpen(false)}
                        onSave={(data) => { editTarget ? saveEdit(data) : createItemFromModal(data); setModalOpen(false) }}
                    />
                    <ItemDetailModal
                        open={detailOpen}
                        item={detailItem}
                        addresses={addresses}
                        onEdit={(it) => { setDetailOpen(false); openEdit(it) }}
                        onDelete={(it) => { deleteItem(it.id); setDetailOpen(false) }}
                        onClose={() => setDetailOpen(false)}
                    />
                </VStack>
            </Box>

            {/* Action Bar for multi-select */}
            <ActionBar.Root
                open={multiSelect}
                closeOnInteractOutside={false}
            >
                <Portal>
                    <ActionBar.Positioner
                        css={{
                            position: 'fixed',
                            bottom: '20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 1000,
                            width: 'fit-content',
                            maxWidth: '90vw',
                            backgroundColor: 'white',
                            borderRadius: 'var(--chakra-radii-l3)',
                            border: '1px var(--chakra-borders-muted)',
                            boxShadow: 'var(--chakra-shadows-md)',
                        }}
                    >
                        <ActionBar.Content
                            css={{
                                background: 'var(--chakra-colors-bg-panel)',
                                boxShadow: 'var(--chakra-shadows-md)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--chakra-spacing-3)',
                                borderRadius: 'var(--chakra-radii-l3)',
                                paddingBlock: 'var(--chakra-spacing-2.5)',
                                paddingInline: 'var(--chakra-spacing-3)',
                                pointerEvents: 'auto',
                                translate: 'calc(-1 * var(--scrollbar-width) / 2) 0px;',
                                height: '56px',
                                bottom: 'calc(env(safe-area-inset-bottom) + 20px)',
                                justifyContent: 'center',
                            }}
                        >
                            <ActionBar.SelectionTrigger
                                css={{
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: 'var(--chakra-colors-fg-emphasized)',
                                    height: '34px',
                                }}
                            >
                                {selectedItems.size} selected
                            </ActionBar.SelectionTrigger>

                            <ActionBar.Separator />


                            <Dialog.Root placement="center">
                                <Dialog.Trigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={!anySelected}
                                        css={{
                                            height: '34px',
                                            width: 'fit-content',
                                        }}
                                    >
                                        Move selected items
                                    </Button>
                                </Dialog.Trigger>
                                <Portal>
                                    <Dialog.Backdrop
                                        css={{
                                            zIndex: 9999
                                        }}
                                    />
                                    <Dialog.Positioner
                                        css={{
                                            zIndex: 10000,
                                            position: 'fixed',
                                            top: 0,
                                            left: 0,
                                            width: '100vw',
                                            height: '100vh',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Dialog.Content
                                            css={{
                                                zIndex: 10001,
                                                minWidth: '400px',
                                                maxWidth: '600px',
                                                background: 'var(--chakra-colors-bg)',
                                                border: '1px solid var(--chakra-colors-border-muted)',
                                                padding: '20px',
                                                boxShadow: 'var(--chakra-shadows-card)',
                                                rounded: 'var(--chakra-radii-lg)',
                                                borderRadius: 'var(--chakra-radii-lg)',
                                            }}
                                        >
                                            <Dialog.Header>
                                                <Dialog.Title>Move selected items</Dialog.Title>
                                                <Dialog.CloseTrigger asChild>
                                                    <CloseButton size="sm" />
                                                </Dialog.CloseTrigger>
                                            </Dialog.Header>
                                            <Dialog.Body>
                                                <Dialog.Description mb={4}>
                                                    Choose where to move {selectedItems.size} selected items:
                                                </Dialog.Description>
                                                <VStack gap={2} align="stretch">
                                                    <Button
                                                        variant={moveTarget === 'all' ? 'solid' : 'outline'}
                                                        colorPalette={moveTarget === 'all' ? 'blue' : 'gray'}
                                                        onClick={() => setMoveTarget('all')}
                                                        justifyContent="flex-start"
                                                    >
                                                        All (no change)
                                                    </Button>
                                                    <Button
                                                        variant={moveTarget === '' ? 'solid' : 'outline'}
                                                        colorPalette={moveTarget === '' ? 'blue' : 'gray'}
                                                        onClick={() => setMoveTarget('')}
                                                        justifyContent="flex-start"
                                                    >
                                                        Unlocated
                                                    </Button>
                                                    {addresses.map((address) => (
                                                        <Button
                                                            key={address.id}
                                                            variant={moveTarget === address.id ? 'solid' : 'outline'}
                                                            colorPalette={moveTarget === address.id ? 'blue' : 'gray'}
                                                            onClick={() => setMoveTarget(address.id)}
                                                            justifyContent="flex-start"
                                                        >
                                                            {address.label}
                                                        </Button>
                                                    ))}
                                                </VStack>
                                            </Dialog.Body>
                                            <Dialog.Footer>
                                                <Dialog.ActionTrigger asChild>
                                                    <Button variant="outline">Cancel</Button>
                                                </Dialog.ActionTrigger>
                                                <Button
                                                    colorPalette="blue"
                                                    onClick={() => bulkMove(moveTarget)}
                                                    disabled={!anySelected}
                                                >
                                                    Move Items
                                                </Button>
                                            </Dialog.Footer>
                                        </Dialog.Content>
                                    </Dialog.Positioner>
                                </Portal>
                            </Dialog.Root>

                            <Dialog.Root placement="center">
                                <Dialog.Trigger asChild>
                                    <Button
                                        variant="surface"
                                        colorPalette="red"
                                        size="sm"
                                        disabled={!anySelected}
                                        css={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            height: '34px',
                                        }}
                                    >
                                        <LuTrash2 />
                                        Delete
                                    </Button>
                                </Dialog.Trigger>
                                <Portal>
                                    <Dialog.Backdrop
                                        css={{
                                            zIndex: 9999
                                        }}
                                    />
                                    <Dialog.Positioner
                                        css={{
                                            zIndex: 10000,
                                            position: 'fixed',
                                            top: 0,
                                            left: 0,
                                            width: '100vw',
                                            height: '100vh',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Dialog.Content
                                            css={{
                                                zIndex: 10001,
                                                minWidth: '400px',
                                                maxWidth: '500px',
                                                backgroundColor: 'var(--chakra-colors-bg)',
                                                border: '1px solid var(--chakra-colors-border-muted)',
                                                padding: '30px',
                                                boxShadow: 'var(--chakra-shadows-card)',
                                                rounded: 'var(--chakra-radii-lg)',
                                                borderRadius: 'var(--chakra-radii-lg)',
                                            }}
                                        >
                                            <Dialog.Header>
                                                <Dialog.Title>Delete items</Dialog.Title>
                                                <Dialog.CloseTrigger asChild>
                                                    <CloseButton size="sm" />
                                                </Dialog.CloseTrigger>
                                            </Dialog.Header>
                                            <Dialog.Body>
                                                <Dialog.Description>
                                                    Are you sure you want to delete {selectedItems.size} items? This action cannot be undone.
                                                </Dialog.Description>
                                            </Dialog.Body>
                                            <Dialog.Footer>
                                                <Dialog.ActionTrigger asChild>
                                                    <Button variant="outline">Cancel</Button>
                                                </Dialog.ActionTrigger>
                                                <Button colorPalette="red" onClick={bulkDelete}>Delete</Button>
                                            </Dialog.Footer>
                                        </Dialog.Content>
                                    </Dialog.Positioner>
                                </Portal>
                            </Dialog.Root>
                            <ActionBar.CloseTrigger asChild>
                                <CloseButton
                                    size="sm"
                                    onClick={() => {
                                        setMultiSelect(false)
                                        setSelectedItems(new Set())
                                    }}
                                />
                            </ActionBar.CloseTrigger>
                        </ActionBar.Content>
                    </ActionBar.Positioner>
                </Portal>
            </ActionBar.Root>
        </Box>
    )
}


