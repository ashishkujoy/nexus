import { Users } from "lucide-react";

export type Filter = {
    name: string;
    colorCode?: string;
    notice?: boolean;
    undeliveredFeedback?: boolean;
}

type FilterProps = {
    filter: Filter;
    setFilter: (filter: Filter) => void;
}

const SearchBar = (props: { value: string; setValue: (s: string) => void; }) => {
    return (
        <div className="form-group">
            <div className="select-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search by intern name"
                    value={props.value}
                    onChange={(e) => props.setValue(e.target.value)}
                />
                <Users className="icon-right" />
            </div>
        </div>
    )
}

const FilterSection = (props: FilterProps) => {
    return (
        <div className="filter-section">
            <div className="filter-options">
                <SearchBar value={props.filter.name} setValue={(name) => props.setFilter({ ...props.filter, name })} />
            </div>
        </div>
    )
}

export default FilterSection;