task :deploy do
  sh 'git push origin main'
  sh 'pnpm run build'
  sh "rsync -auP --no-p --exclude-from='rsync-exclude.txt' ./dist/* $AXE_REMOTE"
end

task default: [:deploy]
