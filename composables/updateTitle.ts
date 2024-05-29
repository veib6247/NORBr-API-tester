export const useUpdateTitle = (pageTitle: string) => {
  const appName = useState('appName')

  useHead({
    title: `${pageTitle} | ${appName.value}`,
  })
}
