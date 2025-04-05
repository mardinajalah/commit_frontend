import { Link } from "react-router-dom";
type AccordionProps = {
  id: number;
  title: string;
  items: {
    id: number;
    title: string;
    path: string;
  }[];
}[];

const Accordion = ({ datas }: { datas: AccordionProps }) => {
  return (
    <div>
      {datas.map((data) => (
        <div key={data.id} className='collapse collapse-arrow hover:bg-gray-100 rounded-lg'>
          <input type='checkbox' name='my-accordion-2' />
          <h1 className='collapse-title p-3 font-semibold'>{data.title}</h1>
          <div className='collapse-content text-sm pl-4'>
            {data.items.map((item) => (
              <Link to={item.path} key={item.id}>
                <h1 className='cursor-pointer mb-2 p-2 hover:bg-gray-200 rounded-md'>{item.title}</h1>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
