# leankit-leadtime

A script to calculate lead time from LeanKit boards

## Getting Started

1. Install Vagrant
2. Fire up Vagrant
   1. `vagrant up`
   2. `vagrant ssh`
3. Run the node script
   1. `node extract-leadtime.js --help`

## Usage

```bash
➜ node extract-leadtime.js
Options:
  --version           Show version number                              [boolean]
  --account           Specify the LeanKit account name (https://<account
                      id>.leankit.com)                                [required]
  --email             The email address used to log in to LeanKit     [required]
  --password, --pass  The password used to log in to LeanKit          [required]
  --boardId, --bid    The id of the board you want to calculate lead time for
                                                                      [required]
  --month, -m         The month as a date to lead time calculation during.
                      Format: YYYY-MM                                 [required]
  --help              Show help                                        [boolean]

Missing required arguments: account, email, password, boardId, month
Please provide all arguments to work with this tool
```

## Dependencies

1. <https://github.com/LeanKit/leankit-node-client>
1. <https://www.npmjs.com/package/yargs>
