import { Main } from "@/components/layout/main"
import { Card } from "../../ui/card"

const PageLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Main>
            <Card className="w-full p-6">
                {children}
            </Card>
        </Main>
    )
}

export default PageLayout
