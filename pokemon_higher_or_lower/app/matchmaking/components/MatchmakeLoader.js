import "./MatchmakeLoader.js";
import Loading from "../../components/Loading";

export default function MatchmakeLoader({ userName}) {
    return (
        <div>
            <p className="mb-3">In Queue</p>
            <Loading/>
        </div>
    );
}