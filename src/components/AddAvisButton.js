import { Fab } from '@mui/material';
import Add from '@mui/icons-material/Add';
import { useSmall } from '@/hooks/useSmall';
import noop from '@/utils/noop';

export default function AddAvisButton({ onClick = noop }) {
    const isSmall = useSmall();

    return (
        <Fab
            color='primary'
            sx={{
                position: 'fixed',
                bottom: isSmall ? '1rem' : '2rem',
                right: isSmall ? '1rem' : '2rem',
            }}
            onClick={onClick}
        >
            <Add />
        </Fab>
    );
}
