import Search from './Search'
import ToolTabs from './ToolTabs'

const TopBar = () => <div className="flex flex-col md:pl-64 sticky">
  <Search />
  <ToolTabs />
</div>

export default TopBar
