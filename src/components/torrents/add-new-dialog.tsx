import { ChangeEventHandler, useState, CSSProperties } from 'react';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  InputLabel,
  Box,
} from '../material-ui-core';
import { FormattedMessage } from 'react-intl';
import { useUiState } from '../state';
import { useAppPreferencesQuery, useTorrentAdd } from '../data';
import { pick, storageGet, storageSet, unsafeMutateDefaults } from '../../utils';
import { NewTorrentOptions } from './types';

const ADD_OPTION_KEY = 'addTorrentOptions';
const ADD_METHOD_KEY = 'addTorrentMethod';

const STYLE_MIN_WIDTH: CSSProperties = { minWidth: 380 };

const storeAddOptions = (i: NewTorrentOptions) => {
  storageSet(
    ADD_OPTION_KEY,
    pick(i, [
      'autoManagement',
      'autoStart',
      'category',
      'cookie',
      'downloadLimit',
      'firstLastPiecePrioritized',
      'sequentialDownload',
      'skipHashChecking',
      'tags',
      'uploadLimit',
    ])
  );

  return i;
};

export const TorrentAddNewDialog = () => {
  const [
    {
      addNewDialog: { isOpen },
    },
    { updateAddNewDialogOpen },
  ] = useUiState();
  const [addOptions, setAddOptions] = useState(() =>
    unsafeMutateDefaults<NewTorrentOptions>({
      autoManagement: true,
      autoStart: true,
      category: '',
      cookie: '',
      downloadLimit: 0,
      firstLastPiecePrioritized: false,
      name: '',
      rootFolder: '',
      savePath: '',
      sequentialDownload: false,
      skipHashChecking: false,
      tags: [] as string[],
      uploadLimit: 0,
    })(storageGet(ADD_OPTION_KEY, {} as NewTorrentOptions))
  );
  const [addMethod, setAddMethod] = useState(storageGet(ADD_METHOD_KEY, 'file' as 'file' | 'url'));
  const [blobs, setBlobs] = useState([] as File[]);
  const [urls, setUrls] = useState([] as string[]);

  const { mutate: uploadFiles } = useTorrentAdd({
    onSuccess: () => {
      updateAddNewDialogOpen({ value: false });
    },
  });

  const { isFetching: isAppPreferenceLoading } = useAppPreferencesQuery({
    onSuccess: res => {
      if (res) {
        setAddOptions(s => ({ ...s, savePath: res.save_path }));
      }
    },
  });

  const handleFileLoad: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    const { files } = target;
    if (files?.length) {
      setBlobs(Array.from(files));
    }
  };

  const handleAddNewItems = () => {
    const {
      rootFolder: root_folder,
      savePath: savepath,
      name: rename,
      cookie,
      category,
      tags = [],
      autoManagement: autoTMM,
      autoStart = true,
      skipHashChecking,
      sequentialDownload,
      firstLastPiecePrioritized,
      downloadLimit: dlLimit,
      uploadLimit: upLimit,
    } = addOptions;

    uploadFiles({
      torrents: addMethod === 'file' ? { files: blobs, _tag: 'file' } : { urls, _tag: 'url' },
      options: {
        root_folder,
        savepath,
        rename,
        cookie,
        category,
        tags: tags.length > 0 ? tags.join(',') : undefined,
        autoTMM,
        paused: String(!autoStart),
        skip_checking: skipHashChecking ? String(skipHashChecking) : undefined,
        sequentialDownload: sequentialDownload ? String(sequentialDownload) : undefined,
        firstLastPiecePrio: firstLastPiecePrioritized ? String(firstLastPiecePrioritized) : undefined,
        dlLimit,
        upLimit,
      },
    });
  };

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={isOpen}
      onClose={() => {
        updateAddNewDialogOpen({ value: false });
      }}
    >
      <DialogTitle>
        <FormattedMessage defaultMessage="Add new torrents" />
      </DialogTitle>
      <DialogContent>
        <FormControl component="fieldset" style={STYLE_MIN_WIDTH}>
          <FormLabel component="legend">
            <FormattedMessage defaultMessage="Method" />
          </FormLabel>
          <RadioGroup
            value={addMethod}
            onChange={({ target }) => {
              const newAddMethod = target.value;
              if (newAddMethod === 'url') {
                setBlobs([]);
              } else {
                setAddOptions(s => ({ ...s, cookie: '' }));
              }
              setAddMethod(storageSet(ADD_METHOD_KEY, target.value !== 'file' ? 'url' : 'file'));
            }}
          >
            <FormControlLabel
              value="url"
              control={<Radio />}
              label={<FormattedMessage defaultMessage="Download files from URLs" />}
            />
            <FormControlLabel
              value="file"
              control={<Radio />}
              label={<FormattedMessage defaultMessage="Upload files from disk" />}
            />
          </RadioGroup>
        </FormControl>

        {addMethod === 'url' && (
          <TextField
            multiline
            label={<FormattedMessage defaultMessage="URLs" />}
            style={STYLE_MIN_WIDTH}
            helperText={<FormattedMessage defaultMessage="One URL/link per line, press Enter to add extra" />}
            onChange={({ target }) => {
              const potentialUrls = target.value.trim().split('\n');
              if (potentialUrls.length > 0) {
                setUrls(potentialUrls);
              }
            }}
          />
        )}

        {addMethod === 'file' && (
          <FormControl>
            <Box marginTop={3} minWidth={STYLE_MIN_WIDTH.minWidth}>
              <input
                hidden
                multiple
                type="file"
                accept="application/x-bittorrent,.torrent"
                id="torrentFiles"
                onChange={handleFileLoad}
              />
              <label htmlFor="torrentFiles">
                <Button variant="contained" component="span">
                  <FormattedMessage
                    defaultMessage="{count, plural,
                        =0 {Click here to select files}
                        one {# file selected}
                        other {# files selected}}"
                    values={{ count: blobs.length }}
                  />
                </Button>
              </label>
            </Box>
          </FormControl>
        )}
        <FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={addOptions.autoStart}
                onChange={({ target }) =>
                  setAddOptions(s => storeAddOptions({ ...s, autoStart: target.checked }))
                }
              />
            }
            label="Start right away"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={addOptions.skipHashChecking}
                onChange={({ target }) =>
                  setAddOptions(s => storeAddOptions({ ...s, skipHashChecking: target.checked }))
                }
              />
            }
            label="Skip Hash Check"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={addOptions.sequentialDownload}
                onChange={({ target }) =>
                  setAddOptions(s => storeAddOptions({ ...s, sequentialDownload: target.checked }))
                }
              />
            }
            label={<FormattedMessage defaultMessage="Download in Sequential Order" />}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={addOptions.firstLastPiecePrioritized}
                onChange={({ target }) =>
                  setAddOptions(s => storeAddOptions({ ...s, firstLastPiecePrioritized: target.checked }))
                }
              />
            }
            label={<FormattedMessage defaultMessage="Prioritize first/last piece" />}
          />
        </FormControl>

        <FormControl>
          <InputLabel id="management-mode">
            <FormattedMessage defaultMessage="Management mode" />
          </InputLabel>
          <Select
            labelId="management-mode"
            style={STYLE_MIN_WIDTH}
            value={addOptions.autoManagement ? 'auto' : 'manual'}
            onChange={({ target }) => {
              setAddOptions(s => storeAddOptions({ ...s, autoManagement: target.value === 'auto' }));
            }}
          >
            <MenuItem value="manual">
              <FormattedMessage defaultMessage="Manual" />
            </MenuItem>
            <MenuItem value="auto">
              <FormattedMessage defaultMessage="Auto" />
            </MenuItem>
          </Select>
        </FormControl>

        <TextField
          id="save-path"
          label={<FormattedMessage defaultMessage="Save Path" />}
          value={addOptions.savePath}
          style={STYLE_MIN_WIDTH}
          onChange={({ target }) => setAddOptions(s => ({ ...s, savePath: target.value }))}
        />
        <TextField
          id="rename-to"
          label={<FormattedMessage defaultMessage="New name" />}
          value={addOptions.name}
          style={STYLE_MIN_WIDTH}
          onChange={({ target }) => setAddOptions(s => ({ ...s, name: target.value }))}
        />
        <TextField
          id="download-rate"
          label={<FormattedMessage defaultMessage="Limit download rate" />}
          value={addOptions.downloadLimit}
          style={STYLE_MIN_WIDTH}
          onChange={({ target }) =>
            setAddOptions(s => storeAddOptions({ ...s, downloadLimit: Number(target.value) }))
          }
        />
        <TextField
          id="upload-rate"
          label={<FormattedMessage defaultMessage="Limit upload rate" />}
          value={addOptions.uploadLimit}
          style={STYLE_MIN_WIDTH}
          onChange={({ target }) =>
            setAddOptions(s => storeAddOptions({ ...s, uploadLimit: Number(target.value) }))
          }
        />
        {addMethod === 'url' && (
          <TextField
            id="cookie"
            label={<FormattedMessage defaultMessage="Cookie" />}
            value={addOptions.cookie}
            style={STYLE_MIN_WIDTH}
            onChange={({ target }) => setAddOptions(s => ({ ...s, cookie: target.value }))}
          />
        )}

        <DialogActions>
          <Button
            disabled={false}
            onClick={() => {
              updateAddNewDialogOpen({ value: false });
            }}
          >
            <FormattedMessage defaultMessage="Cancel" />
          </Button>
          <Button
            disabled={isAppPreferenceLoading || (blobs.length < 1 && urls.length < 1)}
            color="primary"
            variant="contained"
            onClick={handleAddNewItems}
          >
            <FormattedMessage defaultMessage="Add" />
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
