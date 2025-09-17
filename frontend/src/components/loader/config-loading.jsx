import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import './configLoader.css';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const BaseLoading = ({ children, loading = false }) => {
    return (
        <div className={loading ? "relative" : ""}>
            {loading ? (
                <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
                    <div className="flex items-center justify-center">
                        <Spin indicator={antIcon} />
                    </div>
                </div>
            ) : null}
            <div>{children}</div>
        </div>
    );
};

export default BaseLoading;
