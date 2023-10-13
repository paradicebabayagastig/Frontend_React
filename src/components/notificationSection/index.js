// import { Link } from '@remix-run/react';
import { useState, useRef, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Box,
    Button,
    ButtonBase,
    CardActions,
    Chip,
    ClickAwayListener,
    Divider,
    Grid,
    Paper,
    Popper,
    Stack, 
    TextField,
    Typography,
    useMediaQuery 
} from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from './mainCard';
import Transitions from './transitions';
import NotificationList from './notificationList';

// assets
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { tokens } from '../../theme';
// notification status options
const status = [
    {
        value: 'all',
        label: 'All Notification'
    },
    {
        value: 'new',
        label: 'New'
    },
    {
        value: 'unread',
        label: 'Unread'
    },
    {
        value: 'other',
        label: 'Other'
    }
];

// ==============================|| NOTIFICATION ||============================== //

const NotificationSection = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');
    /**
     * anchorRef is used on different componets and specifying one type leads to other components throwing an error
     * */
    const anchorRef = useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);

    const handleChange = (event) => {
        if (event?.target.value) setValue(event?.target.value);
    };

    return (
        <>
            <Box
                sx={{
                    ml: 2,
                    mr: 3,
                    [theme.breakpoints.down('md')]: {
                        mr: 2
                    }
                }}
            >
                <ButtonBase sx={{ borderRadius: '12px' }}>
                    <Avatar
                        variant="rounded"
                        sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            transition: 'all .2s ease-in-out',
                            background: colors.primary[500],
                            color: colors.pinkAccent[400],
                            '&[aria-controls="menu-list-grow"],&:hover': {
                                background: colors.pinkAccent[400],
                                color: "#FFFFFF"
                            }
                        }}
                        ref={anchorRef}
                        aria-controls={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        onClick={handleToggle}
                        color="inherit"
                    >
                        <NotificationsActiveIcon/>
                    </Avatar>
                </ButtonBase>
            </Box>
            <Popper
                placement={matchesXs ? 'bottom' : 'bottom-end'}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [matchesXs ? 5 : 0, 20]
                            }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    <Transitions position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
                        <Paper
                             sx={{
                                width: '400px', // Set an initial width
                                borderRadius: 5
                            }}
                        >
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]} sx={{
                                    borderRadius: 5,
                                    background: colors.primary[400]
                                }}>
                                    <Grid container direction="column" spacing={2}>
                                        <Grid item xs={12}>
                                            <Grid container alignItems="center" justifyContent="space-between" sx={{ pt: 2, px: 2 }}>
                                                <Grid item>
                                                    <Stack direction="row" spacing={2}>
                                                        <Typography variant="subtitle1">History</Typography>
                                                    </Stack>
                                                </Grid>
                                                <Grid item>

                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <PerfectScrollbar
                                                style={{
                                                    width: '100%', // Adjust the width here
                                                    maxWidth: 'calc(100vw - 205px)', // Adjust the maxWidth if needed
                                                    height: '100%',
                                                    maxHeight: 'calc(100vh - 205px)',
                                                    overflowX: 'hidden'
                                                }}
                                            >
                                                    <Grid item xs={12} p={0}>
                                                        <Divider sx={{ my: 0 }} />
                                                    </Grid>
                                                <NotificationList />
                                            </PerfectScrollbar>
                                        </Grid>
                                    </Grid>
                                    <Divider />
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </>
    );
};

export default NotificationSection;